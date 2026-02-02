// ---
// The Voices In My Head Media Group - Gallery Tests
// Test Case Developer: Amsyar
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

const fs = require('fs'); // Imports Node.js filesystem module for file operations
const path = require('path'); // Imports Node.js path module for file path manipulation

// ANSI color codes because we're fancy
const colors = { // Object containing ANSI escape codes for colored terminal output
    reset: '\x1b[0m', // Resets color to default
    red: '\x1b[31m', // Red color for failures
    green: '\x1b[32m', // Green color for passes
    yellow: '\x1b[33m', // Yellow color for warnings
    cyan: '\x1b[36m', // Cyan color for headers/info
}; // Closes colors object

let passCount = 0; // Counter for passed tests
let failCount = 0; // Counter for failed tests

console.log(`${colors.cyan}╭───────────────────── Gallery Tests ─────────────────────╮${colors.reset}`); // Prints top border of header box
console.log(`${colors.cyan}│ Welcome to Gallery Website Test Suite                   │${colors.reset}`); // Prints title line
console.log(`${colors.cyan}│ Running validation checks...                             │${colors.reset}`); // Prints description line
console.log(`${colors.cyan}╰────────── Made with the voices by Muhammad Harith ──────╯${colors.reset}\n`); // Prints bottom border with attribution

function log(level, component, message) { // Logging function with standardized format
    const timestamp = new Date().toISOString(); // Gets current timestamp in ISO 8601 format
    const formattedMessage = message.replace(/\n/g, ' - '); // Replaces newlines with dashes for single-line logs
    console.log(`[${timestamp}] [${component}] [${level}] ${formattedMessage}`); // Outputs formatted log message
} // Closes log function

function assert(condition, testName) { // Assertion function to evaluate test results
    if (condition) { // If test passes
        log('PASS', 'TestRunner', `✓ ${testName}`); // Logs pass to console
        console.log(`${colors.green}  PASS${colors.reset}: ${testName}\n`); // Prints colored pass message
        passCount++; // Increments pass counter
    } else { // If test fails
        log('FAIL', 'TestRunner', `✗ ${testName}`); // Logs failure to console
        console.log(`${colors.red}  FAIL${colors.reset}: ${testName}\n`); // Prints colored fail message
        failCount++; // Increments fail counter
    } // Closes if-else
} // Closes assert function

// Test 1: Check if index.html exists
function testIndexHtmlExists() { // Test function to verify index.html file exists
    const filePath = path.join(__dirname, '..', 'index.html'); // Constructs path to index.html (parent directory)
    const exists = fs.existsSync(filePath); // Checks if file exists synchronously
    assert(exists, 'index.html file exists'); // Asserts file exists
} // Closes test function

// Test 2: Check if index.html contains required elements
function testIndexHtmlStructure() { // Test function to validate HTML structure
    const filePath = path.join(__dirname, '..', 'index.html'); // Constructs path to index.html
    try { // Begins try block for error handling
        const content = fs.readFileSync(filePath, 'utf8'); // Reads file content as UTF-8 string
        const hasGallery = content.includes('id="gallery"'); // Checks for gallery element ID
        const hasLightbox = content.includes('id="lightbox"'); // Checks for lightbox element ID
        const hasDoctype = content.toLowerCase().includes('<!doctype html>'); // Checks for HTML5 doctype (case-insensitive)
        
        assert(hasDoctype && hasGallery && hasLightbox, // Asserts all three conditions are true
            'index.html contains required structure (doctype, gallery, lightbox)'); // Test description
    } catch (error) { // Catches file read errors
        log('ERROR', 'TestRunner', `Failed to read index.html: ${error.message}`); // Logs error message
        assert(false, 'index.html contains required structure'); // Forces test to fail
    } // Closes try-catch
} // Closes test function

// Test 3: Check if CSS file exists
function testCssExists() { // Test function to verify CSS file exists
    const filePath = path.join(__dirname, '..', 'css_styles.css'); // Constructs path to CSS file
    const exists = fs.existsSync(filePath); // Checks if file exists
    assert(exists, 'css_styles.css file exists'); // Asserts file exists
} // Closes test function

// Test 4: Check if JS file exists
function testJsExists() { // Test function to verify JavaScript file exists
    const filePath = path.join(__dirname, '..', 'js_script.js'); // Constructs path to JS file
    const exists = fs.existsSync(filePath); // Checks if file exists
    assert(exists, 'js_script.js file exists'); // Asserts file exists
} // Closes test function

// Test 5: Check if images.json exists and is valid JSON
function testImagesJsonValid() { // Test function to validate images.json
    const filePath = path.join(__dirname, '..', 'images.json'); // Constructs path to images.json
    try { // Begins try block
        const content = fs.readFileSync(filePath, 'utf8'); // Reads file content
        const images = JSON.parse(content); // Parses JSON content
        const isArray = Array.isArray(images); // Checks if parsed data is an array
        const hasItems = images.length > 0; // Checks if array has at least one item
        
        assert(isArray && hasItems, // Asserts both conditions are true
            `images.json is valid JSON array with ${images.length} images`); // Test description with image count
    } catch (error) { // Catches JSON parse or file read errors
        log('ERROR', 'TestRunner', `Failed to parse images.json: ${error.message}`); // Logs error
        assert(false, 'images.json is valid JSON'); // Forces test to fail
    } // Closes try-catch
} // Closes test function

// Test 6: Check if images directory exists
function testImagesDirectoryExists() { // Test function to verify images directory exists
    const dirPath = path.join(__dirname, '..', 'images'); // Constructs path to images directory
    const exists = fs.existsSync(dirPath); // Checks if directory exists
    assert(exists, 'images/ directory exists'); // Asserts directory exists
} // Closes test function

// Test 7: Verify images in JSON actually exist
function testImagesExist() { // Test function to verify all images in JSON exist as files
    const jsonPath = path.join(__dirname, '..', 'images.json'); // Path to images.json
    const imagesDir = path.join(__dirname, '..', 'images'); // Path to images directory
    
    try { // Begins try block
        const images = JSON.parse(fs.readFileSync(jsonPath, 'utf8')); // Reads and parses images.json
        let allExist = true; // Flag to track if all images exist
        let missingImages = []; // Array to store names of missing images
        
        images.forEach(imageName => { // Loops through each image filename
            const imagePath = path.join(imagesDir, imageName); // Constructs full path to image file
            if (!fs.existsSync(imagePath)) { // Checks if image file doesn't exist
                allExist = false; // Sets flag to false
                missingImages.push(imageName); // Adds filename to missing array
            } // Closes if
        }); // Closes forEach
        
        if (missingImages.length > 0) { // If any images are missing
            log('WARN', 'TestRunner', `Missing images: ${missingImages.join(', ')}`); // Logs warning with list of missing images
        } // Closes if
        
        assert(allExist, 'All images listed in images.json exist in images/ directory'); // Asserts all images exist
    } catch (error) { // Catches errors
        log('ERROR', 'TestRunner', `Failed to verify images: ${error.message}`); // Logs error
        assert(false, 'All images exist'); // Forces test to fail
    } // Closes try-catch
} // Closes test function

// Test 8: Check if Dockerfile exists
function testDockerfileExists() { // Test function to verify Dockerfile exists
    const filePath = path.join(__dirname, '..', 'Dockerfile'); // Constructs path to Dockerfile
    const exists = fs.existsSync(filePath); // Checks if file exists
    assert(exists, 'Dockerfile exists for containerization'); // Asserts file exists
} // Closes test function

// Test 9: Validate JavaScript syntax (basic check)
function testJsSyntaxValid() { // Test function to perform basic JS syntax validation
    const filePath = path.join(__dirname, '..', 'js_script.js'); // Path to JavaScript file
    try { // Begins try block
        const content = fs.readFileSync(filePath, 'utf8'); // Reads JS file content
        // Basic syntax check - look for common patterns
        const hasValidStructure = // Checks for common JavaScript patterns
            content.includes('function') || // Looks for function declarations
            content.includes('=>') || // Looks for arrow functions
            content.includes('const') || // Looks for const declarations
            content.includes('let'); // Looks for let declarations
        
        assert(hasValidStructure, 'js_script.js has valid JavaScript syntax'); // Asserts JS file has valid structure
    } catch (error) { // Catches errors
        log('ERROR', 'TestRunner', `Failed to validate JS: ${error.message}`); // Logs error
        assert(false, 'js_script.js has valid JavaScript syntax'); // Forces test to fail
    } // Closes try-catch
} // Closes test function

// Test 10: Check for README
function testReadmeExists() { // Test function to verify README documentation exists
    const filePath = path.join(__dirname, '..', 'README.md'); // Constructs path to README
    const exists = fs.existsSync(filePath); // Checks if file exists
    assert(exists, 'README.md documentation exists'); // Asserts file exists
} // Closes test function

// Test 11: Check for Welcome Button in index.html
function testWelcomeButtonExists() { // Test function to verify welcome button feature exists
    const filePath = path.join(__dirname, '..', 'index.html'); // Path to index.html
    try { // Begins try block
        const content = fs.readFileSync(filePath, 'utf8'); // Reads HTML file
        const hasWelcomeBtn = content.includes('id="welcomeBtn"'); // Checks for button element ID
        const hasWelcomeClass = content.includes('class="welcome-btn"'); // Checks for button CSS class
        const hasWelcomeScript = content.includes('welcomeBtn.addEventListener'); // Checks for JavaScript event listener
        
        assert(hasWelcomeBtn && hasWelcomeClass && hasWelcomeScript, // Asserts all three conditions are true
            'Welcome button exists with proper HTML structure and event listeners'); // Test description
    } catch (error) { // Catches errors
        log('ERROR', 'TestRunner', `Failed to check welcome button: ${error.message}`); // Logs error
        assert(false, 'Welcome button exists'); // Forces test to fail
    } // Closes try-catch
} // Closes test function

// Run all tests
function runAllTests() { // Main test runner function
    log('INFO', 'TestRunner', 'Starting test suite execution'); // Logs test start
    
    testIndexHtmlExists(); // Runs test 1
    testIndexHtmlStructure(); // Runs test 2
    testCssExists(); // Runs test 3
    testJsExists(); // Runs test 4
    testImagesJsonValid(); // Runs test 5
    testImagesDirectoryExists(); // Runs test 6
    testImagesExist(); // Runs test 7
    testDockerfileExists(); // Runs test 8
    testJsSyntaxValid(); // Runs test 9
    testReadmeExists(); // Runs test 10
    testWelcomeButtonExists(); // Runs test 11
    
    // Print summary
    const total = passCount + failCount; // Calculates total number of tests
    console.log(`${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}`); // Prints separator line
    console.log(`${colors.cyan}Test Summary${colors.reset}`); // Prints summary header
    console.log(`${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}`); // Prints separator line
    console.log(`Total Tests: ${total}`); // Prints total test count
    console.log(`${colors.green}Passed: ${passCount}${colors.reset}`); // Prints pass count in green
    console.log(`${colors.red}Failed: ${failCount}${colors.reset}`); // Prints fail count in red
    console.log(`Success Rate: ${((passCount/total) * 100).toFixed(2)}%\n`); // Calculates and prints success percentage
    
    log('INFO', 'TestRunner', `Test execution completed - ${passCount} passed, ${failCount} failed`); // Logs completion
    
    // Exit with appropriate code
    process.exit(failCount > 0 ? 1 : 0); // Exits with code 1 if any failures, 0 if all passed
} // Closes runAllTests function

// Execute tests
runAllTests(); // Calls main test runner to start execution
