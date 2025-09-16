// Global teardown for Playwright tests
const fs = require('fs');
const path = require('path');

async function globalTeardown(config) {
  console.log('🧹 Starting global teardown...');

  try {
    // Generate test summary
    await generateTestSummary();

    // Clean up temporary files (optional)
    if (process.env.CLEANUP_TEMP_FILES === 'true') {
      await cleanupTempFiles();
    }

    // Log final statistics
    await logFinalStats();

    console.log('✅ Global teardown completed successfully');

  } catch (error) {
    console.error('❌ Global teardown failed:', error);
  }
}

async function generateTestSummary() {
  try {
    const resultsPath = 'test-results/test-results.json';

    if (fs.existsSync(resultsPath)) {
      const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

      console.log('📊 Test Summary:');
      console.log(`  - Total tests: ${results.stats?.expected || 0}`);
      console.log(`  - Passed: ${results.stats?.passed || 0}`);
      console.log(`  - Failed: ${results.stats?.failed || 0}`);
      console.log(`  - Flaky: ${results.stats?.flaky || 0}`);
      console.log(`  - Skipped: ${results.stats?.skipped || 0}`);
      console.log(`  - Duration: ${results.stats?.duration || 0}ms`);

      // Create a simple summary file
      const summary = {
        timestamp: new Date().toISOString(),
        stats: results.stats,
        environment: {
          ci: process.env.CI || 'false',
          node: process.version,
          platform: process.platform
        }
      };

      fs.writeFileSync('test-results/summary.json', JSON.stringify(summary, null, 2));
      console.log('📄 Test summary written to test-results/summary.json');
    }
  } catch (error) {
    console.warn('⚠️ Could not generate test summary:', error.message);
  }
}

async function cleanupTempFiles() {
  console.log('🗑️ Cleaning up temporary files...');

  const tempDirs = [
    'temp',
    '.temp',
    'tmp'
  ];

  tempDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`  - Removed: ${dir}/`);
    }
  });
}

async function logFinalStats() {
  const endTime = new Date();
  console.log(`⏱️ Teardown completed at: ${endTime.toISOString()}`);

  // Log disk usage for artifacts
  const directories = ['test-results', 'playwright-report', 'screenshots', 'videos'];

  directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      const size = getDirSize(dir);
      console.log(`💾 ${dir}: ${formatBytes(size)}`);
    }
  });
}

function getDirSize(dirPath) {
  let totalSize = 0;

  try {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        totalSize += getDirSize(filePath);
      } else {
        totalSize += stats.size;
      }
    });
  } catch (error) {
    // Ignore errors for inaccessible directories
  }

  return totalSize;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = globalTeardown;