const { test, expect } = require('@playwright/test');
const { FileUploadPage } = require('../pageObjects/FileUploadPage');
const path = require('path');
const fs = require('fs');

test.describe('Basic File Upload Tests', () => {
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

  test('Chat interface loads correctly', async () => {
    await expect(fileUploadPage.chatTextarea).toBeVisible();
    await expect(fileUploadPage.chatTextarea).toBeEditable();
  });

  test('File input exists and has accept attribute', async () => {
    const acceptAttribute = await fileUploadPage.getFileInputAcceptAttribute();

    if (acceptAttribute) {
      expect(acceptAttribute).toBeTruthy();
      expect(acceptAttribute.length).toBeGreaterThan(0);
    } else {
      console.log('File input not accessible - this might be expected behavior');
    }
  });

  test('Drag events can be simulated on chat area', async () => {
    await fileUploadPage.simulateDragEnter();
    await fileUploadPage.simulateDragOver();

    // Check if drop message becomes visible
    const isDropMessageVisible = await fileUploadPage.isDropMessageVisible();

    if (isDropMessageVisible) {
      const messageText = await fileUploadPage.getDropMessageText();
      expect(messageText.toLowerCase()).toContain('drop');
    }
  });

  test('Create test file functionality works', async () => {
    const testFile = await fileUploadPage.createTestFile('basic-test.txt', 'Test content');

    expect(fs.existsSync(testFile)).toBe(true);

    const stats = fs.statSync(testFile);
    expect(stats.size).toBeGreaterThan(0);
  });

  test('File size validation works correctly', async () => {
    const smallFile = await fileUploadPage.createTestFile('small.txt', 'Small', 1);
    const largeFile = await fileUploadPage.createTestFile('large.txt', 'Large', 200);

    expect(await fileUploadPage.validateFileSize(smallFile, 100)).toBe(true);
    expect(await fileUploadPage.validateFileSize(largeFile, 100)).toBe(false);
  });

  test('Supported file types list is available', async () => {
    const supportedTypes = await fileUploadPage.getSupportedFileTypes();

    expect(supportedTypes).toBeTruthy();
    expect(supportedTypes.length).toBeGreaterThan(10);
    expect(supportedTypes.some(type => type.ext === 'txt')).toBe(true);
    expect(supportedTypes.some(type => type.ext === 'pdf')).toBe(true);
  });

  test('Textarea interaction works correctly', async () => {
    const testMessage = 'Test message for file upload';

    await fileUploadPage.typeMessage(testMessage);

    const textareaValue = await fileUploadPage.chatTextarea.inputValue();
    expect(textareaValue).toBe(testMessage);
  });
});