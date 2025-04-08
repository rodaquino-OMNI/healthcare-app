/**
 * React Import Pattern Fixer Script
 * 
 * This script fixes React import patterns across the project by:
 * 1. Changing named imports of React hooks to use the namespace pattern
 * 2. Ensuring all import declarations come before other statements
 * 
 * Usage: node fix-react-imports.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TypeScript and TSX files in the project
const FILES_PATTERN = 'src/**/*.{ts,tsx}';
const EXCLUDE_PATTERN = 'src/types/**'; // Skip type declaration files

// Regular expression to match React named imports
const REACT_NAMED_IMPORT_REGEX = /import\s+React,\s*{([^}]+)}\s+from\s+['"]react['"];?/;

/**
 * Convert React named imports to namespace pattern
 * @param {string} content - File content
 * @returns {string} - Updated content
 */
function fixReactImports(content) {
  // Check if the file has React named imports
  const match = content.match(REACT_NAMED_IMPORT_REGEX);
  if (!match) return content;

  // Extract named imports
  const namedImports = match[1].split(',').map(imp => imp.trim());
  
  // Create new import statements
  const defaultImport = 'import React from \'react\';';
  const namespaceAccess = `// Access React APIs via namespace
const { ${namedImports.join(', ')} } = React;`;

  // Replace the original import with the new pattern
  const updatedContent = content.replace(
    REACT_NAMED_IMPORT_REGEX,
    defaultImport
  );

  // Find where to insert the namespace access
  // Insert after all imports
  const lines = updatedContent.split('\n');
  let lastImportIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    }
  }

  if (lastImportIndex >= 0) {
    // Insert namespace access after the imports
    lines.splice(lastImportIndex + 1, 0, '', namespaceAccess);
  } else {
    // If no imports found, insert after first line
    lines.splice(1, 0, namespaceAccess);
  }

  return lines.join('\n');
}

/**
 * Process a single file
 * @param {string} filePath - Path to file
 */
function processFile(filePath) {
  try {
    console.log(`Processing: ${filePath}`);
    
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Fix React imports
    const updatedContent = fixReactImports(content);
    
    // Only write if content changed
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`  Updated: ${filePath}`);
    } else {
      console.log(`  No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

/**
 * Main execution
 */
function main() {
  // Get all files matching pattern
  const files = glob.sync(FILES_PATTERN, { ignore: EXCLUDE_PATTERN });
  
  console.log(`Found ${files.length} files to process`);
  
  // Process each file
  files.forEach(processFile);
  
  console.log('Processing complete!');
}

// Run the script
main();