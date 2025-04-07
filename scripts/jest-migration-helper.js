#!/usr/bin/env node

/**
 * Jest v26 to v28 Migration Helper
 * 
 * This script helps with the migration process by:
 * 1. Verifying dependencies have been correctly updated
 * 2. Checking for common patterns that need to be updated
 * 3. Providing guidance on running tests with Jest v28
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

console.log(`${colors.bold}${colors.blue}Jest v26 to v28 Migration Helper${colors.reset}\n`);

async function run() {
  try {
    // Check Node.js version
    const nodeVersion = process.version.slice(1); // remove the 'v' prefix
    const majorVersion = parseInt(nodeVersion.split('.')[0], 10);
    
    if (majorVersion < 14) {
      console.log(`${colors.red}⚠️ Warning: Jest v28 requires Node.js 14 or higher. Current version: ${nodeVersion}${colors.reset}`);
      console.log('Please upgrade Node.js to continue.');
    } else {
      console.log(`${colors.green}✓ Node.js version ${nodeVersion} is compatible with Jest v28${colors.reset}`);
    }

    // Check package.json for Jest dependencies
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Check for Jest-related dependencies
      const devDeps = packageJson.devDependencies || {};
      
      const jestVersion = devDeps.jest || '';
      if (!jestVersion.startsWith('^28')) {
        console.log(`${colors.yellow}⚠️ Jest dependency needs to be updated to v28.x${colors.reset}`);
        console.log(`   Current: ${jestVersion}`);
        console.log('   Run: npm install --save-dev jest@^28.0.0');
      } else {
        console.log(`${colors.green}✓ Jest is at the correct version: ${jestVersion}${colors.reset}`);
      }
      
      // Check for missing jest-environment-jsdom
      if (!devDeps['jest-environment-jsdom']) {
        console.log(`${colors.yellow}⚠️ Missing jest-environment-jsdom dependency${colors.reset}`);
        console.log('   This package is now separate from the main Jest package');
        console.log('   Run: npm install --save-dev jest-environment-jsdom@^28.0.0');
      } else {
        console.log(`${colors.green}✓ jest-environment-jsdom is present${colors.reset}`);
      }
      
      const tsJestVersion = devDeps['ts-jest'] || '';
      if (!tsJestVersion.startsWith('^28')) {
        console.log(`${colors.yellow}⚠️ ts-jest dependency needs to be updated to v28.x${colors.reset}`);
        console.log(`   Current: ${tsJestVersion}`);
        console.log('   Run: npm install --save-dev ts-jest@^28.0.0');
      } else {
        console.log(`${colors.green}✓ ts-jest is at the correct version: ${tsJestVersion}${colors.reset}`);
      }
      
      const typesJestVersion = devDeps['@types/jest'] || '';
      if (!typesJestVersion.startsWith('^28')) {
        console.log(`${colors.yellow}⚠️ @types/jest dependency needs to be updated to v28.x${colors.reset}`);
        console.log(`   Current: ${typesJestVersion}`);
        console.log('   Run: npm install --save-dev @types/jest@^28.0.0');
      } else {
        console.log(`${colors.green}✓ @types/jest is at the correct version: ${typesJestVersion}${colors.reset}`);
      }
    }

    // Check Jest configuration
    const jestConfigPath = path.join(process.cwd(), 'jest.config.js');
    if (fs.existsSync(jestConfigPath)) {
      const jestConfig = fs.readFileSync(jestConfigPath, 'utf8');
      
      // Check for testRunner (removed in Jest v27)
      if (jestConfig.includes('testRunner')) {
        console.log(`${colors.yellow}⚠️ The 'testRunner' option has been removed in Jest v27${colors.reset}`);
        console.log('   Remove this option from your Jest configuration');
      }
      
      // Check for testEnvironment
      if (!jestConfig.includes('testEnvironment')) {
        console.log(`${colors.yellow}⚠️ No 'testEnvironment' specified in Jest config${colors.reset}`);
        console.log('   Add "testEnvironment: \'jsdom\'" to your Jest configuration');
      }
      
      // Check for fakeTimers configuration
      if (!jestConfig.includes('fakeTimers')) {
        console.log(`${colors.yellow}⚠️ No 'fakeTimers' configuration found${colors.reset}`);
        console.log('   Consider adding fakeTimers configuration for better compatibility:');
        console.log(`   ${colors.cyan}fakeTimers: {
    enableGlobally: true,
    legacyFakeTimers: true
  }${colors.reset}`);
      }
    }

    // Search for potential problematic patterns in test files
    console.log('\nScanning for patterns that might need updating...');
    
    try {
      // Check for useFakeTimers usage
      const { stdout: timerResults } = await exec('grep -r "jest.useFakeTimers()" --include="*.ts" --include="*.tsx" .');
      if (timerResults) {
        console.log(`${colors.yellow}⚠️ Found usage of jest.useFakeTimers() without configuration${colors.reset}`);
        console.log('   Update to: jest.useFakeTimers({ legacyFakeTimers: true })');
      }
    } catch (error) {
      // grep returns non-zero exit code when no matches are found, which is fine
    }
    
    try {
      // Check for resetAllMocks usage
      const { stdout: resetResults } = await exec('grep -r "jest.resetAllMocks()" --include="*.ts" --include="*.tsx" .');
      if (resetResults) {
        console.log(`${colors.yellow}⚠️ Found usage of jest.resetAllMocks()${colors.reset}`);
        console.log('   Note: In Jest v28, this only resets mocks created with jest.fn()');
        console.log('   For spied functions, you may need to add jest.restoreAllMocks()');
      }
    } catch (error) {
      // grep returns non-zero exit code when no matches are found, which is fine
    }

    // Final advice
    console.log('\n' + colors.bold + 'Next steps:' + colors.reset);
    console.log(`${colors.cyan}1. Install updated dependencies with:${colors.reset}`);
    console.log('   npm uninstall jest ts-jest @types/jest');
    console.log('   npm install --save-dev jest@^28.0.0 jest-environment-jsdom@^28.0.0 ts-jest@^28.0.0 @types/jest@^28.0.0');
    console.log(`\n${colors.cyan}2. Run tests in update mode to regenerate snapshots:${colors.reset}`);
    console.log('   npm test -- --updateSnapshot');
    console.log(`\n${colors.cyan}3. Check for test failures and fix any issues:${colors.reset}`);
    console.log('   - Timer mock API changes');
    console.log('   - Mock function behavior changes');
    console.log('   - Snapshot format changes');
    console.log(`\n${colors.cyan}4. Verify test coverage:${colors.reset}`);
    console.log('   npm test -- --coverage');

  } catch (error) {
    console.error(`${colors.red}Error running migration helper:${colors.reset}`, error);
  }
}

run();