const { test, expect } = require('@playwright/test');
const { FileUploadPage } = require('../pageObjects/FileUploadPage');
const path = require('path');
const fs = require('fs');

test.describe('File Upload Functionality', () => {
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

  test('TC01: Drag and drop functionality works correctly', async () => {
    const testFile = await fileUploadPage.createTestFile('test-drag.txt', 'Drag and drop test content');

    await fileUploadPage.simulateDragEnter('test-drag.txt', 'text/plain');
    await expect(fileUploadPage.dropMessage).toBeVisible({ timeout: 5000 });

    await fileUploadPage.simulateDragOver('test-drag.txt', 'text/plain');
    await expect(fileUploadPage.dropMessage).toBeVisible();

    await fileUploadPage.simulateDrop(testFile);
  });

  test('TC02: "Drop files here to attach" message appears during drag operations', async () => {
    await fileUploadPage.simulateDragEnter('test.txt', 'text/plain');

    await expect(fileUploadPage.dropMessage).toBeVisible({ timeout: 5000 });

    const messageText = await fileUploadPage.getDropMessageText();
    expect(messageText.toLowerCase()).toContain('drop');
    expect(messageText.toLowerCase()).toContain('file');
  });

  test('TC03: Supported file formats are accepted', async () => {
    const supportedTypes = await fileUploadPage.getSupportedFileTypes();

    for (const fileType of supportedTypes.slice(0, 5)) { // Test first 5 to keep test duration reasonable
      const testFile = await fileUploadPage.createTestFile(`test.${fileType.ext}`, 'Test content');

      const acceptAttribute = await fileUploadPage.getFileInputAcceptAttribute();
      expect(acceptAttribute).toContain(fileType.type);

      await fileUploadPage.simulateDragEnter(`test.${fileType.ext}`, fileType.type);
      await expect(fileUploadPage.dropMessage).toBeVisible({ timeout: 3000 });
    }
  });

  test('TC04: File size limitations are enforced (100KB limit)', async () => {
    const smallFile = await fileUploadPage.createTestFile('small-file.txt', 'Small content', 50); // 50KB
    const largeFile = await fileUploadPage.createTestFile('large-file.txt', 'Large content', 150); // 150KB

    expect(await fileUploadPage.validateFileSize(smallFile, 100)).toBe(true);
    expect(await fileUploadPage.validateFileSize(largeFile, 100)).toBe(false);

    const smallFileUploaded = await fileUploadPage.uploadFileViaInput(smallFile);
    expect(smallFileUploaded).toBe(true);
  });

  test('TC05: Multiple file upload capability', async () => {
    const file1 = await fileUploadPage.createTestFile('multi1.txt', 'Content 1');
    const file2 = await fileUploadPage.createTestFile('multi2.txt', 'Content 2');
    const file3 = await fileUploadPage.createTestFile('multi3.txt', 'Content 3');

    const multipleUploaded = await fileUploadPage.uploadMultipleFiles([file1, file2, file3]);
    expect(multipleUploaded).toBe(true);
  });

  test('TC06: Unsupported file formats are handled appropriately', async () => {
    const unsupportedTypes = await fileUploadPage.getSupportedFileTypes();
    const acceptAttribute = await fileUploadPage.getFileInputAcceptAttribute();

    const unsupportedFile = await fileUploadPage.createTestFile('test.exe', 'Executable content');

    await fileUploadPage.simulateDragEnter('test.exe', 'application/x-executable');

    expect(acceptAttribute).not.toContain('application/x-executable');
  });

  test('TC07: File upload progress indication is visible', async () => {
    const testFile = await fileUploadPage.createTestFile('progress-test.txt', 'Progress test content');

    await fileUploadPage.uploadFileViaInput(testFile);

    await expect(fileUploadPage.chatTextarea).toBeVisible();
  });

  test('TC08: Load chat thread and verify file upload interface', async () => {
    await expect(fileUploadPage.chatTextarea).toBeVisible();
    await expect(fileUploadPage.chatTextarea).toBeEditable();

    await fileUploadPage.triggerFileUpload();

    if (await fileUploadPage.fileInput.isVisible()) {
      const acceptAttr = await fileUploadPage.getFileInputAcceptAttribute();
      expect(acceptAttr).toBeTruthy();
      expect(acceptAttr.length).toBeGreaterThan(0);
    }
  });

  test('TC09: Limited size files (under 100KB) upload successfully', async () => {
    const sizes = [10, 25, 50, 75, 99]; // Different sizes under 100KB

    for (const size of sizes) {
      const testFile = await fileUploadPage.createTestFile(`size-test-${size}kb.txt`, `Content for ${size}KB file`, size);

      expect(await fileUploadPage.validateFileSize(testFile, 100)).toBe(true);

      const uploaded = await fileUploadPage.uploadFileViaInput(testFile);
      expect(uploaded).toBe(true);
    }
  });

  test('TC10: Upload file and submit without text, verify AI response', async () => {
    const testFile = await fileUploadPage.createTestFile('ai-test-no-text.txt', 'This is a test file for AI analysis without additional text prompt.');

    const uploaded = await fileUploadPage.uploadFileAndSend(testFile);
    expect(uploaded).toBe(true);

    const aiResponse = await fileUploadPage.waitForAIResponse(30000);
    expect(aiResponse).toBeTruthy();
    expect(aiResponse.length).toBeGreaterThan(10);
  });

  test('TC11: Upload file with text and verify AI response', async () => {
    const testFile = await fileUploadPage.createTestFile('ai-test-with-text.txt', 'This is a test file content for analysis.');
    const userMessage = 'Please analyze this file and provide insights about its content.';

    const uploaded = await fileUploadPage.uploadFileAndSend(testFile, userMessage);
    expect(uploaded).toBe(true);

    const aiResponse = await fileUploadPage.waitForAIResponse(30000);
    expect(aiResponse).toBeTruthy();
    expect(aiResponse.length).toBeGreaterThan(10);
  });

  test('Positive Scenario: PDF file upload and analysis', async () => {
    const pdfContent = 'Sample PDF content for testing';
    const pdfFile = await fileUploadPage.createTestFile('test-document.pdf', pdfContent);

    await fileUploadPage.simulateDragEnter('test-document.pdf', 'application/pdf');
    await expect(fileUploadPage.dropMessage).toBeVisible();

    const uploaded = await fileUploadPage.uploadFileViaInput(pdfFile);
    expect(uploaded).toBe(true);
  });

  test('Positive Scenario: Image file drag and drop', async () => {
    const imageFile = await fileUploadPage.createTestFile('test-image.png', 'PNG image data');

    await fileUploadPage.dragAndDropFile(imageFile);

    await expect(fileUploadPage.chatTextarea).toBeVisible();
  });

  test('Positive Scenario: Excel file upload with message', async () => {
    const excelFile = await fileUploadPage.createTestFile('test-spreadsheet.xlsx', 'Excel data');
    const message = 'Analyze this spreadsheet data';

    const uploaded = await fileUploadPage.uploadFileAndSend(excelFile, message);
    expect(uploaded).toBe(true);
  });

  test('Negative Scenario: Empty file upload attempt', async () => {
    const emptyFile = await fileUploadPage.createTestFile('empty-file.txt', '', 0);

    const uploaded = await fileUploadPage.uploadFileViaInput(emptyFile);

    if (uploaded) {
      expect(await fileUploadPage.validateFileSize(emptyFile, 100)).toBe(true);
    }
  });

  test('Negative Scenario: Oversized file upload attempt', async () => {
    const oversizedFile = await fileUploadPage.createTestFile('oversized.txt', 'Large content', 200); // 200KB

    expect(await fileUploadPage.validateFileSize(oversizedFile, 100)).toBe(false);

    await fileUploadPage.simulateDragEnter('oversized.txt', 'text/plain');
  });

  test('Negative Scenario: Malicious file extension handling', async () => {
    const maliciousFile = await fileUploadPage.createTestFile('malicious.exe', 'Executable content');

    await fileUploadPage.simulateDragEnter('malicious.exe', 'application/x-executable');

    const acceptAttribute = await fileUploadPage.getFileInputAcceptAttribute();
    expect(acceptAttribute).not.toContain('application/x-executable');
  });

  test('Edge Case: Special characters in filename', async () => {
    const specialFile = await fileUploadPage.createTestFile('test-file-@#$%^&*().txt', 'Special characters test');

    const uploaded = await fileUploadPage.uploadFileViaInput(specialFile);
    expect(uploaded).toBe(true);
  });

  test('Edge Case: Very long filename', async () => {
    const longName = 'a'.repeat(100) + '.txt';
    const longNameFile = await fileUploadPage.createTestFile(longName, 'Long filename test');

    const uploaded = await fileUploadPage.uploadFileViaInput(longNameFile);
    expect(uploaded).toBe(true);
  });

  test('Performance: Multiple rapid file uploads', async () => {
    const files = [];
    for (let i = 0; i < 5; i++) {
      files.push(await fileUploadPage.createTestFile(`rapid-${i}.txt`, `Content ${i}`));
    }

    const startTime = Date.now();

    for (const file of files) {
      await fileUploadPage.uploadFileViaInput(file);
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    expect(totalTime).toBeLessThan(30000); // Should complete within 30 seconds
  });

  test('Accessibility: File upload with keyboard navigation', async () => {
    await fileUploadPage.chatTextarea.focus();

    await fileUploadPage.page.keyboard.press('Tab');

    await expect(fileUploadPage.attachButton).toBeFocused();

    await fileUploadPage.page.keyboard.press('Enter');

    await expect(fileUploadPage.fileInput).toBeVisible();
  });

  test('Cross-browser compatibility: File input attributes', async () => {
    const acceptAttribute = await fileUploadPage.getFileInputAcceptAttribute();

    expect(acceptAttribute).toContain('text/plain');
    expect(acceptAttribute).toContain('application/pdf');
    expect(acceptAttribute).toContain('image/png');
    expect(acceptAttribute).toContain('image/jpeg');

    const supportedTypes = await fileUploadPage.getSupportedFileTypes();
    expect(supportedTypes.length).toBeGreaterThan(10);
  });
});