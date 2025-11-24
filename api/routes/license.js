const express = require('express');
const router = express.Router();
const { query } = require('../services/database');
const crypto = require('crypto');

// ============================================
// PUBLIC LICENSE VERIFICATION
// ============================================

// Verify license key
router.post('/verify', async (req, res) => {
  try {
    const { license_key, domain } = req.body;

    if (!license_key) {
      return res.status(400).json({ 
        valid: false, 
        error: 'License key is required' 
      });
    }

    // Get license details
    const licenseResult = await query(`
      SELECT l.*, p.name as product_name, p.version as product_version
      FROM licenses l
      JOIN products p ON l.product_id = p.id
      WHERE l.license_key = $1
    `, [license_key]);

    if (licenseResult.rows.length === 0) {
      return res.status(404).json({ 
        valid: false, 
        error: 'Invalid license key' 
      });
    }

    const license = licenseResult.rows[0];

    // Check if license is active
    if (license.status !== 'active') {
      return res.status(403).json({ 
        valid: false, 
        error: `License is ${license.status}`,
        status: license.status
      });
    }

    // Check expiry
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      await query('UPDATE licenses SET status = $1 WHERE id = $2', ['expired', license.id]);
      return res.status(403).json({ 
        valid: false, 
        error: 'License has expired',
        expired_at: license.expires_at
      });
    }

    // Check domain if provided
    if (domain) {
      const domainsResult = await query(
        'SELECT * FROM license_domains WHERE license_id = $1',
        [license.id]
      );

      const authorizedDomains = domainsResult.rows.map(d => d.domain);
      
      // Check if domain is authorized
      const isDomainAuthorized = authorizedDomains.some(authDomain => {
        // Support wildcard subdomains
        if (authDomain.startsWith('*.')) {
          const baseDomain = authDomain.substring(2);
          return domain.endsWith(baseDomain);
        }
        return domain === authDomain || domain === `www.${authDomain}`;
      });

      if (authorizedDomains.length > 0 && !isDomainAuthorized) {
        return res.status(403).json({ 
          valid: false, 
          error: 'Domain not authorized for this license',
          authorized_domains: authorizedDomains
        });
      }
    }

    // Update last verified timestamp
    await query(
      'UPDATE licenses SET last_verified_at = NOW() WHERE id = $1',
      [license.id]
    );

    // Return success response
    res.json({
      valid: true,
      license: {
        key: license.license_key,
        product: license.product_name,
        version: license.product_version,
        type: license.license_type,
        status: license.status,
        expires_at: license.expires_at,
        features: license.features || {}
      }
    });

  } catch (error) {
    console.error('Error verifying license:', error);
    res.status(500).json({ 
      valid: false, 
      error: 'Internal server error' 
    });
  }
});

// Activate license for domain
router.post('/activate', async (req, res) => {
  try {
    const { license_key, domain, environment = 'production' } = req.body;

    if (!license_key || !domain) {
      return res.status(400).json({ 
        success: false, 
        error: 'License key and domain are required' 
      });
    }

    // Get license details
    const licenseResult = await query(
      'SELECT * FROM licenses WHERE license_key = $1',
      [license_key]
    );

    if (licenseResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Invalid license key' 
      });
    }

    const license = licenseResult.rows[0];

    // Check if license is active
    if (license.status !== 'active') {
      return res.status(403).json({ 
        success: false, 
        error: `License is ${license.status}` 
      });
    }

    // Check domain limit
    const domainCountResult = await query(
      'SELECT COUNT(*) as count FROM license_domains WHERE license_id = $1',
      [license.id]
    );

    const domainCount = parseInt(domainCountResult.rows[0].count);

    if (domainCount >= license.max_domains) {
      return res.status(403).json({ 
        success: false, 
        error: `Maximum domain limit (${license.max_domains}) reached` 
      });
    }

    // Check if domain already exists
    const existingDomainResult = await query(
      'SELECT * FROM license_domains WHERE license_id = $1 AND domain = $2',
      [license.id, domain]
    );

    if (existingDomainResult.rows.length > 0) {
      return res.json({ 
        success: true, 
        message: 'Domain already activated' 
      });
    }

    // Add domain
    await query(`
      INSERT INTO license_domains (license_id, domain, environment, activated_at)
      VALUES ($1, $2, $3, NOW())
    `, [license.id, domain, environment]);

    // Update license activation count
    await query(
      'UPDATE licenses SET activation_count = activation_count + 1 WHERE id = $1',
      [license.id]
    );

    res.json({
      success: true,
      message: 'Domain activated successfully',
      domains_used: domainCount + 1,
      domains_limit: license.max_domains
    });

  } catch (error) {
    console.error('Error activating license:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Deactivate license for domain
router.post('/deactivate', async (req, res) => {
  try {
    const { license_key, domain } = req.body;

    if (!license_key || !domain) {
      return res.status(400).json({ 
        success: false, 
        error: 'License key and domain are required' 
      });
    }

    // Get license
    const licenseResult = await query(
      'SELECT * FROM licenses WHERE license_key = $1',
      [license_key]
    );

    if (licenseResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Invalid license key' 
      });
    }

    const license = licenseResult.rows[0];

    // Remove domain
    const deleteResult = await query(
      'DELETE FROM license_domains WHERE license_id = $1 AND domain = $2 RETURNING *',
      [license.id, domain]
    );

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Domain not found for this license' 
      });
    }

    res.json({
      success: true,
      message: 'Domain deactivated successfully'
    });

  } catch (error) {
    console.error('Error deactivating license:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Get license info (public endpoint for customers)
router.get('/info/:license_key', async (req, res) => {
  try {
    const { license_key } = req.params;

    const licenseResult = await query(`
      SELECT 
        l.license_key,
        l.license_type,
        l.status,
        l.expires_at,
        l.max_domains,
        l.download_limit,
        l.download_count,
        p.name as product_name,
        p.version as product_version
      FROM licenses l
      JOIN products p ON l.product_id = p.id
      WHERE l.license_key = $1
    `, [license_key]);

    if (licenseResult.rows.length === 0) {
      return res.status(404).json({ error: 'License not found' });
    }

    const license = licenseResult.rows[0];

    // Get activated domains
    const domainsResult = await query(
      'SELECT domain, environment, activated_at FROM license_domains WHERE license_id = (SELECT id FROM licenses WHERE license_key = $1)',
      [license_key]
    );

    res.json({
      license: {
        ...license,
        activated_domains: domainsResult.rows
      }
    });

  } catch (error) {
    console.error('Error fetching license info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check for updates
router.post('/check-updates', async (req, res) => {
  try {
    const { license_key, current_version } = req.body;

    if (!license_key) {
      return res.status(400).json({ error: 'License key is required' });
    }

    // Verify license
    const licenseResult = await query(`
      SELECT l.*, p.name as product_name, p.version as latest_version, p.changelog
      FROM licenses l
      JOIN products p ON l.product_id = p.id
      WHERE l.license_key = $1 AND l.status = 'active'
    `, [license_key]);

    if (licenseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid or inactive license' });
    }

    const license = licenseResult.rows[0];

    // Compare versions
    const hasUpdate = current_version && license.latest_version > current_version;

    res.json({
      has_update: hasUpdate,
      current_version: current_version,
      latest_version: license.latest_version,
      changelog: hasUpdate ? license.changelog : null,
      download_url: hasUpdate ? `/api/license/download/${license_key}` : null
    });

  } catch (error) {
    console.error('Error checking for updates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download product (requires valid license)
router.get('/download/:license_key', async (req, res) => {
  try {
    const { license_key } = req.params;

    // Verify license
    const licenseResult = await query(`
      SELECT l.*, p.download_url, p.name as product_name
      FROM licenses l
      JOIN products p ON l.product_id = p.id
      WHERE l.license_key = $1 AND l.status = 'active'
    `, [license_key]);

    if (licenseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid or inactive license' });
    }

    const license = licenseResult.rows[0];

    // Check download limit
    if (license.download_limit && license.download_count >= license.download_limit) {
      return res.status(403).json({ error: 'Download limit exceeded' });
    }

    // Update download count
    await query(
      'UPDATE licenses SET download_count = download_count + 1, last_download_at = NOW() WHERE id = $1',
      [license.id]
    );

    // Log download
    await query(`
      INSERT INTO downloads (user_id, product_id, license_id, ip_address)
      VALUES ($1, $2, $3, $4)
    `, [license.user_id, license.product_id, license.id, req.ip]);

    // Generate temporary download URL or redirect
    if (license.download_url) {
      res.redirect(license.download_url);
    } else {
      res.status(404).json({ error: 'Download URL not available' });
    }

  } catch (error) {
    console.error('Error processing download:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
