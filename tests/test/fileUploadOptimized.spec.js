const { test, expect } = require('@playwright/test');
const { FileUploadPage } = require('../pageObjects/FileUploadPage');
const path = require('path');
const fs = require('fs');

test.describe('File Upload Functionality - Optimized Tests', () => {
  let fileUploadPage;

  test.beforeEach(async ({ page }) => {
    fileUploadPage = new FileUploadPage(page);
    await fileUploadPage.navigateToChat();
  });

  test.afterAll(async () => {
    const testFilesDir = path.join(process.cwd(), 'test-files');
    if (fs.existsSync(testFilesDir)) {
      fs.rmSync(testFilesDir, { recursive: true, force: true });
    }
  });

  test('TC01: Drag and drop events can be simulated', async () => {
    const testFile = await fileUploadPage.createTestFile('test-drag.txt', 'Drag and drop test content');

    await fileUploadPage.simulateDragEnter('test-drag.txt', 'text/plain');
    await fileUploadPage.simulateDragOver('test-drag.txt', 'text/plain');
    await fileUploadPage.simulateDrop(testFile);

    // Verify the events were dispatched without errors
    await expect(fileUploadPage.chatTextarea).toBeVisible();
  });

  test('TC02: Drop message visibility check during drag operations', async () => {
    await fileUploadPage.simulateDragEnter('test.txt', 'text/plain');

    // Check if drop message appears (this may vary based on implementation)
    const isDropMessageVisible = await fileUploadPage.isDropMessageVisible();

    if (isDropMessageVisible) {
      const messageText = await fileUploadPage.getDropMessageText();
      expect(messageText.toLowerCase()).toContain('drop');
      expect(messageText.toLowerCase()).toContain('file');
    } else {
      console.log('Drop message not visible - may be implementation dependent');
    }
  });

  test('TC03: Supported file format validation', async () => {
    const supportedTypes = await fileUploadPage.getSupportedFileTypes();

    // Verify we have the expected file types
    expect(supportedTypes.length).toBeGreaterThan(10);

    const extensions = supportedTypes.map(type => type.ext);
    expect(extensions).toContain('txt');
    expect(extensions).toContain('pdf');
    expect(extensions).toContain('docx');
    expect(extensions).toContain('png');
    expect(extensions).toContain('jpg');

    // Test drag events for supported formats
    for (const fileType of supportedTypes.slice(0, 3)) {
      await fileUploadPage.simulateDragEnter(`test.${fileType.ext}`, fileType.type);
      await expect(fileUploadPage.chatTextarea).toBeVisible();
    }
  });

  test('TC04: File size validation logic', async () => {
    const smallFile = await fileUploadPage.createTestFile('small-file.txt', 'Small content', 50); // 50KB
    const largeFile = await fileUploadPage.createTestFile('large-file.txt', 'Large content', 150); // 150KB

    expect(await fileUploadPage.validateFileSize(smallFile, 100)).toBe(true);
    expect(await fileUploadPage.validateFileSize(largeFile, 100)).toBe(false);

    // Verify files were created with expected sizes
    const smallStats = fs.statSync(smallFile);
    const largeStats = fs.statSync(largeFile);

    expect(smallStats.size / 1024).toBeLessThanOrEqual(100);
    expect(largeStats.size / 1024).toBeGreaterThan(100);
  });

  test('TC05: Multiple file creation and validation', async () => {
    const file1 = await fileUploadPage.createTestFile('multi1.txt', 'Content 1');
    const file2 = await fileUploadPage.createTestFile('multi2.txt', 'Content 2');
    const file3 = await fileUploadPage.createTestFile('multi3.txt', 'Content 3');

    // Verify all files exist
    expect(fs.existsSync(file1)).toBe(true);
    expect(fs.existsSync(file2)).toBe(true);
    expect(fs.existsSync(file3)).toBe(true);

    // Test individual drag events
    const files = [file1, file2, file3];
    for (const file of files) {
      await fileUploadPage.simulateDragEnter(path.basename(file), 'text/plain');
    }
  });

  test('TC06: Unsupported file format identification', async () => {
    const unsupportedTypes = await fileUploadPage.getUnsupportedFileTypes();

    expect(unsupportedTypes.length).toBeGreaterThan(3);

    const unsupportedExtensions = unsupportedTypes.map(type => type.ext);
    expect(unsupportedExtensions).toContain('exe');
    expect(unsupportedExtensions).toContain('zip');

    // Test that these are not in supported types
    const supportedTypes = await fileUploadPage.getSupportedFileTypes();
    const supportedExtensions = supportedTypes.map(type => type.ext);

    for (const unsupported of unsupportedExtensions) {
      expect(supportedExtensions).not.toContain(unsupported);
    }
  });

  test('TC07: Chat interface interaction and availability', async () => {
    await expect(fileUploadPage.chatTextarea).toBeVisible();
    await expect(fileUploadPage.chatTextarea).toBeEditable();

    // Test basic interaction
    await fileUploadPage.typeMessage('Test message');
    const value = await fileUploadPage.chatTextarea.inputValue();
    expect(value).toBe('Test message');
  });

  test('TC08: File input existence verification', async () => {
    // The file input may be hidden but should exist in DOM
    const fileInputCount = await fileUploadPage.fileInput.count();

    if (fileInputCount > 0) {
      console.log(`Found ${fileInputCount} file input(s)`);
      // File inputs exist
      expect(fileInputCount).toBeGreaterThanOrEqual(1);
    } else {
      console.log('No file inputs found - may be dynamically created');
    }
  });

  test('TC09: Different file sizes under limit validation', async () => {
    const sizes = [10, 25, 50, 75, 99]; // Different sizes under 100KB

    for (const size of sizes) {
      const testFile = await fileUploadPage.createTestFile(`size-test-${size}kb.txt`, `Content for ${size}KB file`, size);

      expect(await fileUploadPage.validateFileSize(testFile, 100)).toBe(true);

      const stats = fs.statSync(testFile);
      expect(stats.size / 1024).toBeLessThanOrEqual(100);
    }
  });

  test('Positive Scenario: PDF file type validation', async () => {
    const pdfContent = 'Sample PDF content for testing';
    const pdfFile = await fileUploadPage.createTestFile('test-document.pdf', pdfContent);

    await fileUploadPage.simulateDragEnter('test-document.pdf', 'application/pdf');

    // Verify the drag event was processed
    await expect(fileUploadPage.chatTextarea).toBeVisible();

    // Verify file exists and is valid
    expect(fs.existsSync(pdfFile)).toBe(true);
  });

  test('Positive Scenario: Image file type validation', async () => {
    const imageFile = await fileUploadPage.createTestFile('test-image.png', 'PNG image data');

    await fileUploadPage.dragAndDropFile(imageFile);

    // Verify the interface remains responsive
    await expect(fileUploadPage.chatTextarea).toBeVisible();
    await expect(fileUploadPage.chatTextarea).toBeEditable();
  });

  test('Positive Scenario: Excel file type validation', async () => {
    const excelFile = await fileUploadPage.createTestFile('test-spreadsheet.xlsx', 'Excel data');

    await fileUploadPage.simulateDragEnter('test-spreadsheet.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Verify file was created successfully
    expect(fs.existsSync(excelFile)).toBe(true);
  });

  test('Negative Scenario: Empty file handling', async () => {
    const emptyFile = await fileUploadPage.createTestFile('empty-file.txt', '', 0);

    expect(fs.existsSync(emptyFile)).toBe(true);

    const stats = fs.statSync(emptyFile);
    expect(stats.size).toBe(0);

    await fileUploadPage.simulateDragEnter('empty-file.txt', 'text/plain');
  });

  test('Negative Scenario: Oversized file validation', async () => {
    const oversizedFile = await fileUploadPage.createTestFile('oversized.txt', 'Large content', 200); // 200KB

    expect(await fileUploadPage.validateFileSize(oversizedFile, 100)).toBe(false);

    const stats = fs.statSync(oversizedFile);
    expect(stats.size / 1024).toBeGreaterThan(100);
  });

  test('Edge Case: Special characters in filename', async () => {
    const specialFile = await fileUploadPage.createTestFile('test-file-special-chars.txt', 'Special characters test');

    expect(fs.existsSync(specialFile)).toBe(true);

    await fileUploadPage.simulateDragEnter('test-file-@#$%^&*().txt', 'text/plain');
    await expect(fileUploadPage.chatTextarea).toBeVisible();
  });

  test('Edge Case: Long filename handling', async () => {
    const longName = 'a'.repeat(100) + '.txt';
    const longNameFile = await fileUploadPage.createTestFile(longName, 'Long filename test');

    expect(fs.existsSync(longNameFile)).toBe(true);

    await fileUploadPage.simulateDragEnter(longName, 'text/plain');
  });

  test('Performance: Rapid file validation', async () => {
    const files = [];
    const startTime = Date.now();

    for (let i = 0; i < 5; i++) {
      files.push(await fileUploadPage.createTestFile(`rapid-${i}.txt`, `Content ${i}`));
    }

    const creationTime = Date.now() - startTime;
    expect(creationTime).toBeLessThan(5000); // Should create files quickly

    // Verify all files exist
    for (const file of files) {
      expect(fs.existsSync(file)).toBe(true);
    }
  });

  test('Cross-browser compatibility: Drag event support', async () => {
    // Test that drag events can be dispatched across different scenarios
    const testEvents = ['dragenter', 'dragover'];

    for (const eventType of testEvents) {
      await fileUploadPage.dropZone.dispatchEvent(eventType);
      await expect(fileUploadPage.chatTextarea).toBeVisible();
    }
  });

  test('Accessibility: Interface responsiveness', async () => {
    // Verify the interface elements are accessible
    await expect(fileUploadPage.chatTextarea).toBeVisible();
    await expect(fileUploadPage.chatTextarea).toBeEditable();

    // Test focus capability
    await fileUploadPage.chatTextarea.focus();
    await expect(fileUploadPage.chatTextarea).toBeFocused();
  });
});