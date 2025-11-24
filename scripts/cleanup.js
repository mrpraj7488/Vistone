#!/usr/bin/env node

/**
 * Project Cleanup Script
 * Removes cache files, temporary files, and build artifacts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Directories and files to clean
const cleanupTargets = [
  // Build artifacts
  'dist',
  'build',
  '.next',
  'out',
  
  // Cache directories
  '.vite',
  '.cache',
  '.parcel-cache',
  '.eslintcache',
  '.stylelintcache',
  
  // Temporary files
  'tmp',
  'temp',
  
  // Log files
  '*.log',
  'npm-debug.log*',
  'yarn-debug.log*',
  'yarn-error.log*',
  
  // OS files
  '.DS_Store',
  'Thumbs.db',
  
  // Editor files
  '*.swp',
  '*.swo',
  '*~'
];

// File extensions to clean
const tempExtensions = ['.tmp', '.temp', '.bak', '.backup', '.old'];

function deleteRecursive(targetPath) {
  if (fs.existsSync(targetPath)) {
    if (fs.lstatSync(targetPath).isDirectory()) {
      fs.rmSync(targetPath, { recursive: true, force: true });
      console.log(`🗑️  Removed directory: ${path.relative(projectRoot, targetPath)}`);
    } else {
      fs.unlinkSync(targetPath);
      console.log(`🗑️  Removed file: ${path.relative(projectRoot, targetPath)}`);
    }
  }
}

function cleanDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.lstatSync(itemPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules but clean other directories
      if (item !== 'node_modules') {
        cleanDirectory(itemPath);
      }
      
      // Remove empty directories (except important ones)
      const importantDirs = ['src', 'public', 'components', 'pages', 'services', 'store'];
      if (!importantDirs.includes(item)) {
        try {
          const dirContents = fs.readdirSync(itemPath);
          if (dirContents.length === 0) {
            fs.rmdirSync(itemPath);
            console.log(`🗑️  Removed empty directory: ${path.relative(projectRoot, itemPath)}`);
          }
        } catch (error) {
          // Directory not empty or other error, skip
        }
      }
    } else {
      // Check for temporary file extensions
      const ext = path.extname(item);
      if (tempExtensions.includes(ext)) {
        deleteRecursive(itemPath);
      }
      
      // Check for specific patterns
      if (item.includes('~') || item.startsWith('.#') || item.endsWith('.log')) {
        deleteRecursive(itemPath);
      }
    }
  }
}

function main() {
  console.log('🧹 Starting project cleanup...\n');
  
  // Clean specific targets in project root
  for (const target of cleanupTargets) {
    const targetPath = path.join(projectRoot, target);
    
    if (target.includes('*')) {
      // Handle glob patterns
      const dir = path.dirname(targetPath);
      const pattern = path.basename(target);
      
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (file.match(pattern.replace('*', '.*'))) {
            deleteRecursive(path.join(dir, file));
          }
        }
      }
    } else {
      deleteRecursive(targetPath);
    }
  }
  
  // Clean source directory recursively
  console.log('\n🔍 Scanning for temporary files...');
  cleanDirectory(path.join(projectRoot, 'src'));
  
  // Clean node_modules cache
  const nodeModulesCache = path.join(projectRoot, 'node_modules', '.cache');
  if (fs.existsSync(nodeModulesCache)) {
    deleteRecursive(nodeModulesCache);
  }
  
  console.log('\n✅ Cleanup completed!');
  console.log('\n📊 Recommendations:');
  console.log('   • Run "npm run build" to test production build');
  console.log('   • Run "npm run lint" to check code quality');
  console.log('   • Consider running "npm audit" for security check');
}

// Run cleanup
main();
