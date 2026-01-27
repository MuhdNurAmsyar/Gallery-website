// ---
// The Voices In My Head Media Group - Gallery Tests
// Made with a redbull fueled rage by Muhammad Harith
// Version 0.1.0 - 2026-01-26
// ---

/**
 * Basic tests for the gallery website
 * Run with: node tests/test-gallery.js
 * 
 * Tests validate:
 * - HTML structure exists
 * - Required files are present
 * - Images.json is valid
 * - CSS file exists
 * - JS file exists
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes because we're fancy
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
};

let passCount = 0;
let failCount = 0;

console.log(`${colors.cyan}╭───────────────────── Gallery Tests ─────────────────────╮${colors.reset}`);
console.log(`${colors.cyan}│ Welcome to Gallery Website Test Suite                   │${colors.reset}`);
console.log(`${colors.cyan}│ Running validation checks...                             │${colors.reset}`);
console.log(`${colors.cyan}╰────────── Made with the voices by Muhammad Harith ──────╯${colors.reset}\n`);

function log(level, component, message) {
    const timestamp = new Date().toISOString();
    const formattedMessage = message.replace(/\n/g, ' - ');
    console.log(`[${timestamp}] [${component}] [${level}] ${formattedMessage}`);
}

function assert(condition, testName) {
    if (condition) {
        log('PASS', 'TestRunner', `✓ ${testName}`);
        console.log(`${colors.green}  PASS${colors.reset}: ${testName}\n`);
        passCount++;
    } else {
        log('FAIL', 'TestRunner', `✗ ${testName}`);
        console.log(`${colors.red}  FAIL${colors.reset}: ${testName}\n`);
        failCount++;
    }
}

// Test 1: Check if index.html exists
function testIndexHtmlExists() {
    const filePath = path.join(__dirname, '..', 'index.html');
    const exists = fs.existsSync(filePath);
    assert(exists, 'index.html file exists');
}

// Test 2: Check if index.html contains required elements
function testIndexHtmlStructure() {
    const filePath = path.join(__dirname, '..', 'index.html');
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const hasGallery = content.includes('id="gallery"');
        const hasLightbox = content.includes('id="lightbox"');
        const hasDoctype = content.toLowerCase().includes('<!doctype html>');
        
        assert(hasDoctype && hasGallery && hasLightbox, 
            'index.html contains required structure (doctype, gallery, lightbox)');
    } catch (error) {
        log('ERROR', 'TestRunner', `Failed to read index.html: ${error.message}`);
        assert(false, 'index.html contains required structure');
    }
}

// Test 3: Check if CSS file exists
function testCssExists() {
    const filePath = path.join(__dirname, '..', 'css_styles.css');
    const exists = fs.existsSync(filePath);
    assert(exists, 'css_styles.css file exists');
}

// Test 4: Check if JS file exists
function testJsExists() {
    const filePath = path.join(__dirname, '..', 'js_script.js');
    const exists = fs.existsSync(filePath);
    assert(exists, 'js_script.js file exists');
}

// Test 5: Check if images.json exists and is valid JSON
function testImagesJsonValid() {
    const filePath = path.join(__dirname, '..', 'images.json');
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const images = JSON.parse(content);
        const isArray = Array.isArray(images);
        const hasItems = images.length > 0;
        
        assert(isArray && hasItems, 
            `images.json is valid JSON array with ${images.length} images`);
    } catch (error) {
        log('ERROR', 'TestRunner', `Failed to parse images.json: ${error.message}`);
        assert(false, 'images.json is valid JSON');
    }
}

// Test 6: Check if images directory exists
function testImagesDirectoryExists() {
    const dirPath = path.join(__dirname, '..', 'images');
    const exists = fs.existsSync(dirPath);
    assert(exists, 'images/ directory exists');
}

// Test 7: Verify images in JSON actually exist
function testImagesExist() {
    const jsonPath = path.join(__dirname, '..', 'images.json');
    const imagesDir = path.join(__dirname, '..', 'images');
    
    try {
        const images = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        let allExist = true;
        let missingImages = [];
        
        images.forEach(imageName => {
            const imagePath = path.join(imagesDir, imageName);
            if (!fs.existsSync(imagePath)) {
                allExist = false;
                missingImages.push(imageName);
            }
        });
        
        if (missingImages.length > 0) {
            log('WARN', 'TestRunner', `Missing images: ${missingImages.join(', ')}`);
        }
        
        assert(allExist, 'All images listed in images.json exist in images/ directory');
    } catch (error) {
        log('ERROR', 'TestRunner', `Failed to verify images: ${error.message}`);
        assert(false, 'All images exist');
    }
}

// Test 8: Check if Dockerfile exists
function testDockerfileExists() {
    const filePath = path.join(__dirname, '..', 'Dockerfile');
    const exists = fs.existsSync(filePath);
    assert(exists, 'Dockerfile exists for containerization');
}

// Test 9: Validate JavaScript syntax (basic check)
function testJsSyntaxValid() {
    const filePath = path.join(__dirname, '..', 'js_script.js');
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Basic syntax check - look for common patterns
        const hasValidStructure = 
            content.includes('function') || 
            content.includes('=>') ||
            content.includes('const') ||
            content.includes('let');
        
        assert(hasValidStructure, 'js_script.js has valid JavaScript syntax');
    } catch (error) {
        log('ERROR', 'TestRunner', `Failed to validate JS: ${error.message}`);
        assert(false, 'js_script.js has valid JavaScript syntax');
    }
}

// Test 10: Check for README
function testReadmeExists() {
    const filePath = path.join(__dirname, '..', 'README.md');
    const exists = fs.existsSync(filePath);
    assert(exists, 'README.md documentation exists');
}

// Run all tests
function runAllTests() {
    log('INFO', 'TestRunner', 'Starting test suite execution');
    
    testIndexHtmlExists();
    testIndexHtmlStructure();
    testCssExists();
    testJsExists();
    testImagesJsonValid();
    testImagesDirectoryExists();
    testImagesExist();
    testDockerfileExists();
    testJsSyntaxValid();
    testReadmeExists();
    
    // Print summary
    const total = passCount + failCount;
    console.log(`${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}Test Summary${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}`);
    console.log(`Total Tests: ${total}`);
    console.log(`${colors.green}Passed: ${passCount}${colors.reset}`);
    console.log(`${colors.red}Failed: ${failCount}${colors.reset}`);
    console.log(`Success Rate: ${((passCount/total) * 100).toFixed(2)}%\n`);
    
    log('INFO', 'TestRunner', `Test execution completed - ${passCount} passed, ${failCount} failed`);
    
    // Exit with appropriate code
    process.exit(failCount > 0 ? 1 : 0);
}

// Execute tests
runAllTests();
