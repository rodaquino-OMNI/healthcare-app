#!/usr/bin/env node

/**
 * Subpackage Jest Configuration Updater
 * 
 * This script scans for Jest configurations in subpackages within the monorepo
 * and provides instructions for updating them to match the root configuration.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

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

console.log(`${colors.bold}${colors.magenta}Subpackage Jest Configuration Scanner${colors.reset}\n`);

// Find all jest.config.* files in components and packages directories
const findJestConfigs = () => {
  const patterns = [
    './components/**/jest.config.js',
    './components/**/jest.config.ts',
    './packages/**/jest.config.js',
    './packages/**/jest.config.ts'
  ];
  
  let allConfigs = [];
  
  patterns.forEach(pattern => {
    try {
      const configs = glob.sync(pattern, { ignore: ['**/node_modules/**'] });
      allConfigs = [...allConfigs, ...configs];
    } catch (error) {
      console.error(`Error searching for ${pattern}:`, error);
    }
  });
  
  return allConfigs;
};

// Find package.json files that contain jest configurations
const findPackageJsonWithJest = () => {
  const patterns = [
    './components/**/package.json',
    './packages/**/package.json'
  ];
  
  let packageJsonsWithJest = [];
  
  patterns.forEach(pattern => {
    try {
      const packageJsons = glob.sync(pattern, { ignore: ['**/node_modules/**'] });
      
      packageJsons.forEach(packageJsonPath => {
        try {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          if (packageJson.jest) {
            packageJsonsWithJest.push(packageJsonPath);
          }
        } catch (error) {
          console.error(`Error processing ${packageJsonPath}:`, error);
        }
      });
    } catch (error) {
      console.error(`Error searching for ${pattern}:`, error);
    }
  });
  
  return packageJsonsWithJest;
};

// Check if a Jest config needs updating for v28 compatibility
const checkConfigNeedsUpdate = (configPath) => {
  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    const issues = [];
    
    if (configContent.includes('testRunner')) {
      issues.push('Contains "testRunner" option which has been removed in Jest v27+');
    }
    
    if (!configContent.includes('testEnvironment')) {
      issues.push('Missing "testEnvironment" option which is required in Jest v28');
    }
    
    if (configContent.includes('ts-jest') && !configContent.includes('legacyFakeTimers')) {
      issues.push('ts-jest configuration may need updating for timer compatibility');
    }
    
    return { 
      needsUpdate: issues.length > 0,
      issues
    };
  } catch (error) {
    console.error(`Error reading ${configPath}:`, error);
    return { 
      needsUpdate: false,
      issues: [`Error reading file: ${error.message}`]
    };
  }
};

// Check package.json jest configuration
const checkPackageJsonJestConfig = (packageJsonPath) => {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const jestConfig = packageJson.jest || {};
    
    const issues = [];
    
    if (jestConfig.testRunner) {
      issues.push('Contains "testRunner" option which has been removed in Jest v27+');
    }
    
    if (!jestConfig.testEnvironment) {
      issues.push('Missing "testEnvironment" option which is required in Jest v28');
    }
    
    if (jestConfig.transform && JSON.stringify(jestConfig.transform).includes('ts-jest') 
        && !JSON.stringify(jestConfig).includes('legacyFakeTimers')) {
      issues.push('ts-jest configuration may need updating for timer compatibility');
    }
    
    return { 
      needsUpdate: issues.length > 0,
      issues
    };
  } catch (error) {
    console.error(`Error reading ${packageJsonPath}:`, error);
    return { 
      needsUpdate: false,
      issues: [`Error reading file: ${error.message}`]
    };
  }
};

// Generate update suggestions
const generateUpdateSuggestions = (configPath, issues) => {
  let suggestions = [];
  
  if (issues.includes('Contains "testRunner" option which has been removed in Jest v27+')) {
    suggestions.push('Remove the "testRunner" option');
  }
  
  if (issues.includes('Missing "testEnvironment" option which is required in Jest v28')) {
    suggestions.push('Add "testEnvironment: \'jsdom\'"');
  }
  
  if (issues.includes('ts-jest configuration may need updating for timer compatibility')) {
    suggestions.push('Add fakeTimers configuration for backward compatibility:');
    suggestions.push('  fakeTimers: { enableGlobally: true, legacyFakeTimers: true }');
    suggestions.push('Update ts-jest configuration to use the shared ts-jest.config.js file');
  }
  
  return suggestions;
};

// Main function
const main = () => {
  // Find Jest configuration files
  const jestConfigFiles = findJestConfigs();
  console.log(`Found ${jestConfigFiles.length} Jest configuration files in subpackages`);
  
  let needsUpdateCount = 0;
  
  jestConfigFiles.forEach(configPath => {
    const { needsUpdate, issues } = checkConfigNeedsUpdate(configPath);
    
    if (needsUpdate) {
      needsUpdateCount++;
      console.log(`\n${colors.yellow}⚠️ ${configPath} needs updates:${colors.reset}`);
      issues.forEach(issue => console.log(`  - ${issue}`));
      
      const suggestions = generateUpdateSuggestions(configPath, issues);
      if (suggestions.length > 0) {
        console.log(`\n${colors.cyan}Suggested updates:${colors.reset}`);
        suggestions.forEach(suggestion => console.log(`  - ${suggestion}`));
      }
    } else {
      console.log(`${colors.green}✓ ${configPath} appears to be compatible with Jest v28${colors.reset}`);
    }
  });
  
  // Find package.json files with Jest configurations
  const packageJsonsWithJest = findPackageJsonWithJest();
  console.log(`\nFound ${packageJsonsWithJest.length} package.json files with Jest configurations`);
  
  packageJsonsWithJest.forEach(packageJsonPath => {
    const { needsUpdate, issues } = checkPackageJsonJestConfig(packageJsonPath);
    
    if (needsUpdate) {
      needsUpdateCount++;
      console.log(`\n${colors.yellow}⚠️ ${packageJsonPath} contains Jest config that needs updates:${colors.reset}`);
      issues.forEach(issue => console.log(`  - ${issue}`));
      
      const suggestions = generateUpdateSuggestions(packageJsonPath, issues);
      if (suggestions.length > 0) {
        console.log(`\n${colors.cyan}Suggested updates:${colors.reset}`);
        suggestions.forEach(suggestion => console.log(`  - ${suggestion}`));
        console.log(`  - Consider moving Jest config to a separate jest.config.js file`);
      }
    } else {
      console.log(`${colors.green}✓ ${packageJsonPath} Jest config appears to be compatible with Jest v28${colors.reset}`);
    }
  });
  
  // Summary
  console.log(`\n${colors.bold}Summary:${colors.reset}`);
  console.log(`Total configurations found: ${jestConfigFiles.length + packageJsonsWithJest.length}`);
  console.log(`Configurations needing updates: ${needsUpdateCount}`);
  
  if (needsUpdateCount > 0) {
    console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
    console.log(`1. Update each identified configuration file to be Jest v28 compatible`);
    console.log(`2. Consider standardizing configurations across packages`);
    console.log(`3. Run tests in each package to verify compatibility`);
  } else {
    console.log(`\n${colors.green}All Jest configurations appear to be compatible with Jest v28!${colors.reset}`);
  }
};

// Check if glob is installed, since it's required for this script
try {
  require.resolve('glob');
  main();
} catch (error) {
  console.error(`${colors.red}Error: This script requires the 'glob' package.${colors.reset}`);
  console.log(`Please install it with: npm install --save-dev glob`);
}