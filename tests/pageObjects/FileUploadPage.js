const { expect } = require('@playwright/test');
const path = require('path');

class FileUploadPage {
  constructor(page) {
    this.page = page;
    this.chatTextarea = page.locator('textarea').first();
    this.fileInput = page.locator('input[type="file"]');
    this.dropZone = page.locator('textarea, .chat-input, [data-testid*="chat"]').first();
    this.dropMessage = page.getByText(/drop.*file/i);
    this.sendButton = page.locator('button').filter({ has: page.locator('svg') }).last();
    this.attachButton = page.locator('button').filter({ has: page.locator('svg') }).first();
  }

  async navigateToChat() {
    await this.page.goto('https://app-test.ideoz.ai/');
    await this.page.waitForLoadState('networkidle');
    await this.chatTextarea.click();
    await this.page.waitForTimeout(1000);
  }

  async triggerFileUpload() {
    try {
      if (await this.attachButton.isVisible()) {
        await this.attachButton.click();
        await this.page.waitForTimeout(1000);
      }
    } catch (error) {
      // Button might not be visible or clickable
      console.log('Attach button not accessible:', error.message);
    }
  }

  async uploadFileViaInput(filePath) {
    await this.triggerFileUpload();
    if (await this.fileInput.isVisible()) {
      await this.fileInput.setInputFiles(filePath);
      return true;
    }
    return false;
  }

  async simulateDragEnter(fileName = 'test.txt', fileType = 'text/plain') {
    await this.dropZone.dispatchEvent('dragenter');
    await this.page.waitForTimeout(500);
  }

  async simulateDragOver(fileName = 'test.txt', fileType = 'text/plain') {
    await this.dropZone.dispatchEvent('dragover');
    await this.page.waitForTimeout(500);
  }

  async simulateDrop(filePath) {
    await this.dropZone.dispatchEvent('drop');
    await this.page.waitForTimeout(1000);
  }

  async dragAndDropFile(filePath) {
    await this.simulateDragEnter(path.basename(filePath));
    await this.simulateDragOver(path.basename(filePath));
    await this.simulateDrop(filePath);
  }

  async uploadMultipleFiles(filePaths) {
    await this.triggerFileUpload();
    if (await this.fileInput.isVisible()) {
      await this.fileInput.setInputFiles(filePaths);
      return true;
    }
    return false;
  }

  async typeMessage(message) {
    await this.chatTextarea.fill(message);
  }

  async sendMessage() {
    if (await this.sendButton.isVisible()) {
      await this.sendButton.click();
      await this.page.waitForTimeout(1000);
    }
  }

  async uploadFileAndSend(filePath, message = '') {
    const uploaded = await this.uploadFileViaInput(filePath);
    if (uploaded && message) {
      await this.typeMessage(message);
    }
    await this.sendMessage();
    return uploaded;
  }

  async getFileInputAcceptAttribute() {
    try {
      await this.triggerFileUpload();
      const fileInputCount = await this.fileInput.count();
      if (fileInputCount > 0) {
        const firstInput = this.fileInput.first();
        return await firstInput.getAttribute('accept');
      }
    } catch (error) {
      console.log('Could not access file input accept attribute:', error.message);
    }
    return null;
  }

  async isDropMessageVisible() {
    return await this.dropMessage.isVisible();
  }

  async getDropMessageText() {
    if (await this.isDropMessageVisible()) {
      return await this.dropMessage.textContent();
    }
    return null;
  }

  async waitForAIResponse(timeout = 30000) {
    const responseLocator = this.page.locator('.ai-response, [data-testid*="response"], .response-message').first();
    try {
      await responseLocator.waitFor({ timeout });
      return await responseLocator.textContent();
    } catch (error) {
      return null;
    }
  }

  async createTestFile(fileName, content = 'Test file content', sizeInKB = 1) {
    const testFilesDir = path.join(process.cwd(), 'test-files');
    const fs = require('fs');

    if (!fs.existsSync(testFilesDir)) {
      fs.mkdirSync(testFilesDir, { recursive: true });
    }

    const filePath = path.join(testFilesDir, fileName);
    const contentSize = sizeInKB * 1024;
    const paddedContent = content.padEnd(contentSize, ' ');

    fs.writeFileSync(filePath, paddedContent);
    return filePath;
  }

  async validateFileSize(filePath, maxSizeKB = 100) {
    const fs = require('fs');
    const stats = fs.statSync(filePath);
    const fileSizeKB = stats.size / 1024;
    return fileSizeKB <= maxSizeKB;
  }

  async getSupportedFileTypes() {
    return [
      { ext: 'txt', type: 'text/plain' },
      { ext: 'md', type: 'text/markdown' },
      { ext: 'pdf', type: 'application/pdf' },
      { ext: 'docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      { ext: 'doc', type: 'application/msword' },
      { ext: 'pptx', type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
      { ext: 'ppt', type: 'application/vnd.ms-powerpoint' },
      { ext: 'xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
      { ext: 'xls', type: 'application/vnd.ms-excel' },
      { ext: 'jpg', type: 'image/jpeg' },
      { ext: 'jpeg', type: 'image/jpeg' },
      { ext: 'png', type: 'image/png' },
      { ext: 'gif', type: 'image/gif' },
      { ext: 'webp', type: 'image/webp' },
      { ext: 'svg', type: 'image/svg+xml' }
    ];
  }

  async getUnsupportedFileTypes() {
    return [
      { ext: 'exe', type: 'application/x-executable' },
      { ext: 'zip', type: 'application/zip' },
      { ext: 'rar', type: 'application/x-rar-compressed' },
      { ext: 'mp4', type: 'video/mp4' },
      { ext: 'mp3', type: 'audio/mp3' },
      { ext: 'avi', type: 'video/avi' }
    ];
  }
}

module.exports = { FileUploadPage };