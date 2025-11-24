const nodemailer = require('nodemailer');
const { query } = require('./database');
const fs = require('fs').promises;
const path = require('path');
const handlebars = require('handlebars');

// ============================================
// EMAIL SERVICE CONFIGURATION
// ============================================

class EmailService {
  constructor() {
    this.transporter = null;
    this.templates = new Map();
    this.initialized = false;
  }

  async initialize() {
    try {
      // Create transporter based on configuration
      if (process.env.SMTP_HOST) {
        this.transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
          }
        });
      } else {
        // Use test account for development
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransporter({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
        console.log('Using test email account:', testAccount.user);
      }

      // Verify connection
      await this.transporter.verify();
      console.log('✅ Email service connected');

      // Load email templates
      await this.loadTemplates();

      this.initialized = true;
    } catch (error) {
      console.error('❌ Email service initialization failed:', error);
      throw error;
    }
  }

  async loadTemplates() {
    const templatesDir = path.join(__dirname, '../templates/email');
    
    try {
      const templateFiles = await fs.readdir(templatesDir);
      
      for (const file of templateFiles) {
        if (file.endsWith('.hbs')) {
          const templateName = file.replace('.hbs', '');
          const templatePath = path.join(templatesDir, file);
          const templateContent = await fs.readFile(templatePath, 'utf8');
          const compiledTemplate = handlebars.compile(templateContent);
          this.templates.set(templateName, compiledTemplate);
        }
      }
      
      console.log(`📧 Loaded ${this.templates.size} email templates`);
    } catch (error) {
      console.warn('⚠️ Could not load email templates:', error.message);
      // Create default templates in memory
      this.createDefaultTemplates();
    }
  }

  createDefaultTemplates() {
    // Default email templates
    const defaultTemplates = {
      welcome: `
        <h1>Welcome to {{site_name}}!</h1>
        <p>Hi {{user_name}},</p>
        <p>Thank you for joining {{site_name}}. We're excited to have you on board!</p>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="{{verification_link}}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>Best regards,<br>The {{site_name}} Team</p>
      `,
      
      order_confirmation: `
        <h1>Order Confirmation #{{order_number}}</h1>
        <p>Hi {{user_name}},</p>
        <p>Thank you for your purchase! Your order has been confirmed.</p>
        <div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0;">
          <h3>Order Details:</h3>
          <p><strong>Product:</strong> {{product_name}}</p>
          <p><strong>License Type:</strong> {{license_type}}</p>
          <p><strong>License Key:</strong> <code>{{license_key}}</code></p>
          <p><strong>Total Amount:</strong> ${{total_amount}}</p>
        </div>
        <p>You can download your product and manage your licenses from your dashboard:</p>
        <a href="{{download_url}}" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
        <p>Best regards,<br>The {{site_name}} Team</p>
      `,
      
      license_key: `
        <h1>Your License Key for {{product_name}}</h1>
        <p>Hi {{user_name}},</p>
        <p>Here is your license key for {{product_name}}:</p>
        <div style="background: #f8f9fa; border: 1px solid #dee2e6; padding: 20px; margin: 20px 0; text-align: center;">
          <h2 style="margin: 0; font-family: monospace;">{{license_key}}</h2>
        </div>
        <p><strong>License Type:</strong> {{license_type}}</p>
        <p>{{activation_instructions}}</p>
        <p>Please keep this license key safe and do not share it with others.</p>
        <p>Best regards,<br>The {{site_name}} Team</p>
      `,
      
      support_reply: `
        <h1>Response to Your Support Ticket</h1>
        <p>Hi {{customer_name}},</p>
        <p>We have responded to your support ticket #{{ticket_number}}.</p>
        <div style="border-left: 4px solid #007bff; padding-left: 20px; margin: 20px 0;">
          <p><strong>Subject:</strong> {{ticket_subject}}</p>
          <p><strong>Our Response:</strong></p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
            {{message}}
          </div>
        </div>
        <p>You can view the full conversation and reply from your dashboard:</p>
        <a href="{{ticket_link}}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Ticket</a>
        <p>Best regards,<br>The {{site_name}} Support Team</p>
      `,
      
      password_reset: `
        <h1>Reset Your Password</h1>
        <p>Hi {{user_name}},</p>
        <p>You requested to reset your password. Click the link below to create a new password:</p>
        <a href="{{reset_link}}" style="background: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in {{expiry_time}}.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The {{site_name}} Team</p>
      `,
      
      contact_form: `
        <h1>New Contact Form Submission</h1>
        <p><strong>From:</strong> {{name}} ({{email}})</p>
        <p><strong>Subject:</strong> {{subject}}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
          {{message}}
        </div>
        <p><strong>Submitted:</strong> {{timestamp}}</p>
        <p><strong>IP Address:</strong> {{ip}}</p>
      `,
      
      newsletter_welcome: `
        <h1>Welcome to Our Newsletter!</h1>
        <p>Hi {{name}},</p>
        <p>Thank you for subscribing to our newsletter! You'll receive updates about:</p>
        <ul>
          <li>New product releases</li>
          <li>Special offers and discounts</li>
          <li>Industry insights and tips</li>
          <li>Company news and updates</li>
        </ul>
        <p>Stay tuned for great content!</p>
        <p>Best regards,<br>The {{site_name}} Team</p>
      `
    };

    // Compile default templates
    for (const [name, content] of Object.entries(defaultTemplates)) {
      const compiledTemplate = handlebars.compile(content);
      this.templates.set(name, compiledTemplate);
    }
  }

  async sendEmail({ to, subject, template, data = {}, html, text, attachments = [] }) {
    if (!this.initialized) {
      throw new Error('Email service not initialized');
    }

    try {
      let emailHtml = html;
      let emailText = text;

      // Use template if provided
      if (template && this.templates.has(template)) {
        const compiledTemplate = this.templates.get(template);
        emailHtml = compiledTemplate({
          site_name: process.env.SITE_NAME || 'Vistone',
          site_url: process.env.FRONTEND_URL || 'http://localhost:3000',
          ...data
        });
      }

      const mailOptions = {
        from: `"${process.env.SITE_NAME || 'Vistone'}" <${process.env.FROM_EMAIL || 'noreply@vistone.com'}>`,
        to,
        subject,
        html: emailHtml,
        text: emailText,
        attachments
      };

      const result = await this.transporter.sendMail(mailOptions);

      // Log email to database
      await this.logEmail({
        recipient_email: to,
        subject,
        template_name: template,
        template_data: data,
        status: 'sent',
        sent_at: new Date()
      });

      // Log preview URL for development
      if (process.env.NODE_ENV === 'development' && result.messageId) {
        console.log('📧 Email sent:', nodemailer.getTestMessageUrl(result));
      }

      return result;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      
      // Log failed email
      await this.logEmail({
        recipient_email: to,
        subject,
        template_name: template,
        template_data: data,
        status: 'failed',
        error_message: error.message
      });

      throw error;
    }
  }

  async logEmail(emailData) {
    try {
      await query(`
        INSERT INTO email_queue (
          recipient_email, recipient_name, subject, template_name, 
          template_data, status, sent_at, error_message
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        emailData.recipient_email,
        emailData.recipient_name || null,
        emailData.subject,
        emailData.template_name || null,
        emailData.template_data ? JSON.stringify(emailData.template_data) : null,
        emailData.status,
        emailData.sent_at || null,
        emailData.error_message || null
      ]);
    } catch (error) {
      console.error('Failed to log email:', error);
    }
  }

  async processEmailQueue() {
    try {
      // Get pending emails
      const pendingEmails = await query(`
        SELECT * FROM email_queue 
        WHERE status = 'pending' AND attempts < 3
        ORDER BY priority DESC, created_at ASC
        LIMIT 10
      `);

      for (const email of pendingEmails.rows) {
        try {
          // Update attempts
          await query(`
            UPDATE email_queue 
            SET attempts = attempts + 1, last_attempt_at = NOW()
            WHERE id = $1
          `, [email.id]);

          // Parse template data
          let templateData = {};
          if (email.template_data) {
            try {
              templateData = JSON.parse(email.template_data);
            } catch (e) {
              console.warn('Failed to parse template data:', e);
            }
          }

          // Send email
          await this.sendEmail({
            to: email.recipient_email,
            subject: email.subject,
            template: email.template_name,
            data: templateData,
            html: email.body
          });

          // Mark as sent
          await query(`
            UPDATE email_queue 
            SET status = 'sent', sent_at = NOW()
            WHERE id = $1
          `, [email.id]);

        } catch (error) {
          console.error(`Failed to send queued email ${email.id}:`, error);
          
          // Mark as failed if max attempts reached
          if (email.attempts >= 2) {
            await query(`
              UPDATE email_queue 
              SET status = 'failed', error_message = $1
              WHERE id = $2
            `, [error.message, email.id]);
          }
        }
      }
    } catch (error) {
      console.error('Error processing email queue:', error);
    }
  }

  async queueEmail(emailData) {
    try {
      await query(`
        INSERT INTO email_queue (
          recipient_email, recipient_name, subject, body,
          template_name, template_data, priority, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
      `, [
        emailData.to,
        emailData.recipient_name || null,
        emailData.subject,
        emailData.html || null,
        emailData.template || null,
        emailData.data ? JSON.stringify(emailData.data) : null,
        emailData.priority || 'normal'
      ]);
    } catch (error) {
      console.error('Failed to queue email:', error);
      throw error;
    }
  }
}

// ============================================
// EMAIL AUTOMATION TRIGGERS
// ============================================

class EmailAutomation {
  constructor(emailService) {
    this.emailService = emailService;
  }

  async triggerWelcomeEmail(user) {
    const verificationToken = this.generateVerificationToken();
    
    await query(`
      UPDATE users SET email_verification_token = $1 WHERE id = $2
    `, [verificationToken, user.id]);

    await this.emailService.sendEmail({
      to: user.email,
      subject: `Welcome to ${process.env.SITE_NAME || 'Vistone'}!`,
      template: 'welcome',
      data: {
        user_name: user.name,
        verification_link: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
      }
    });
  }

  async triggerOrderConfirmation(order, user, product) {
    await this.emailService.sendEmail({
      to: user.email,
      subject: `Order Confirmation #${order.order_number}`,
      template: 'order_confirmation',
      data: {
        user_name: user.name,
        order_number: order.order_number,
        product_name: product.name,
        license_type: order.license_type,
        license_key: order.license_key,
        total_amount: order.total_amount,
        download_url: `${process.env.FRONTEND_URL}/dashboard/downloads`
      }
    });
  }

  async triggerLicenseKey(order, user, product) {
    await this.emailService.sendEmail({
      to: user.email,
      subject: `Your License Key for ${product.name}`,
      template: 'license_key',
      data: {
        user_name: user.name,
        product_name: product.name,
        license_key: order.license_key,
        license_type: order.license_type,
        activation_instructions: 'Please keep this license key safe. You will need it to activate your product.'
      }
    });
  }

  async triggerSupportReply(ticket, user, message) {
    await this.emailService.sendEmail({
      to: user.email,
      subject: `Response to Your Ticket #${ticket.ticket_number}`,
      template: 'support_reply',
      data: {
        customer_name: user.name,
        ticket_number: ticket.ticket_number,
        ticket_subject: ticket.subject,
        message: message.message,
        ticket_link: `${process.env.FRONTEND_URL}/dashboard/support/${ticket.id}`
      }
    });
  }

  async triggerPasswordReset(user, resetToken) {
    const expiryTime = '1 hour';
    
    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Reset Your Password',
      template: 'password_reset',
      data: {
        user_name: user.name,
        reset_link: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
        expiry_time: expiryTime
      }
    });
  }

  async triggerProductUpdate(product, users) {
    for (const user of users) {
      await this.emailService.queueEmail({
        to: user.email,
        subject: `Update Available: ${product.name}`,
        template: 'product_update',
        data: {
          user_name: user.name,
          product_name: product.name,
          version: product.version,
          changelog: product.changelog || 'Bug fixes and improvements',
          download_link: `${process.env.FRONTEND_URL}/dashboard/downloads`
        },
        priority: 'low'
      });
    }
  }

  async triggerLicenseExpiring(license, user, product) {
    const daysUntilExpiry = Math.ceil((new Date(license.expires_at) - new Date()) / (1000 * 60 * 60 * 24));
    
    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Your License is Expiring Soon',
      template: 'license_expiring',
      data: {
        user_name: user.name,
        product_name: product.name,
        days_until_expiry: daysUntilExpiry,
        expiry_date: new Date(license.expires_at).toLocaleDateString(),
        renewal_link: `${process.env.FRONTEND_URL}/products/${product.slug}`
      }
    });
  }

  generateVerificationToken() {
    return require('crypto').randomBytes(32).toString('hex');
  }
}

// ============================================
// INITIALIZE AND EXPORT
// ============================================

const emailService = new EmailService();
const emailAutomation = new EmailAutomation(emailService);

// Start email queue processor
setInterval(() => {
  if (emailService.initialized) {
    emailService.processEmailQueue();
  }
}, 30000); // Process every 30 seconds

module.exports = {
  emailService,
  emailAutomation,
  initializeEmail: () => emailService.initialize(),
  sendEmail: (options) => emailService.sendEmail(options),
  queueEmail: (options) => emailService.queueEmail(options)
};
