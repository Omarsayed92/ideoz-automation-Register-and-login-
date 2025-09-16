# Complete Setup Guide for Playwright CI/CD Framework

## 🚀 Quick Start

### 1. Install Docker (Required for CI/CD)

**Windows:**
1. Download Docker Desktop from https://www.docker.com/products/docker-desktop
2. Run the installer and follow the setup wizard
3. Enable WSL 2 integration when prompted
4. Restart your computer
5. Start Docker Desktop and wait for it to initialize

**Verify Installation:**
```bash
docker --version
docker-compose --version
```

### 2. GitHub Repository Setup

#### Create GitHub Repository:
1. Go to https://github.com/new
2. Repository name: `ideoz-playwright-tests`
3. Description: `Advanced Playwright Test Framework for Ideoz Application`
4. Set to Public or Private (your choice)
5. Don't initialize with README (we have one)
6. Click "Create repository"

#### Connect Local Repository:
```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/ideoz-playwright-tests.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Configure GitHub Secrets (Optional but Recommended)

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets for notifications:
- `SLACK_WEBHOOK_URL`: Your Slack webhook URL for test notifications
- `TEAMS_WEBHOOK_URL`: Your Microsoft Teams webhook URL

### 4. Enable GitHub Pages (For Test Reports)

1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: gh-pages (will be created automatically)
4. Folder: / (root)
5. Save

### 5. Test Local Setup

```bash
# Install dependencies
npm install

# Run single test to verify setup
npm run test:chromium -- --grep "should navigate to login modal"

# Run all tests
npm test

# View test report
npm run report
```

### 6. Test Docker Setup

```bash
# Build Docker image
npm run docker:build

# Run tests in Docker
npm run docker:test

# Run with Docker Compose
npm run docker:up
```

## 🔧 CI/CD Pipeline Overview

### Automated Workflows

1. **Main Test Pipeline** (`.github/workflows/playwright-tests.yml`)
   - Triggers: Push to main/develop, Pull Requests
   - Runs: Cross-browser tests (Chrome, Firefox, Safari)
   - Features: Parallel execution, test sharding, artifact upload

2. **Docker Tests** (`.github/workflows/docker-tests.yml`)
   - Triggers: Push to main/develop, Pull Requests
   - Runs: Containerized tests with security scanning
   - Features: Trivy security scans, Docker image testing

3. **Performance Tests** (`.github/workflows/performance-tests.yml`)
   - Triggers: Daily schedule, manual dispatch
   - Runs: Lighthouse audits, load testing
   - Features: Performance monitoring, k6 load tests

4. **Visual Regression** (`.github/workflows/visual-regression.yml`)
   - Triggers: Push to main, Pull Requests
   - Runs: Screenshot comparisons
   - Features: Visual diff detection, PR comments

5. **Notifications** (`.github/workflows/notifications.yml`)
   - Triggers: When other workflows complete
   - Features: Slack/Teams notifications, automatic issue creation

### Pipeline Features

✅ **Cross-browser Testing**: Chrome, Firefox, Safari, Edge, Mobile
✅ **Parallel Execution**: Fast test runs with worker distribution
✅ **Test Sharding**: Split tests across multiple runners
✅ **Retry Mechanism**: Automatic retry for flaky tests
✅ **Artifact Collection**: Screenshots, videos, traces, reports
✅ **Security Scanning**: Container vulnerability assessment
✅ **Performance Monitoring**: Page load times and metrics
✅ **Visual Testing**: Screenshot comparison and diff detection
✅ **Smart Notifications**: Success/failure alerts with context
✅ **Auto Issue Creation**: Automatic bug reports for main branch failures

## 📊 Test Reports and Monitoring

### View Test Results

1. **GitHub Actions**: Check the Actions tab in your repository
2. **HTML Reports**: Automatically published to GitHub Pages
3. **Artifacts**: Download from completed workflow runs
4. **Live Reports**: `npm run report` for local viewing

### Report Locations

- **HTML Report**: `playwright-report/index.html`
- **JUnit XML**: `test-results/junit-report.xml`
- **JSON Results**: `test-results/test-results.json`
- **Screenshots**: `test-results/` (on failures)
- **Videos**: `test-results/` (on failures)
- **Traces**: `test-results/` (for debugging)

## 🐛 Troubleshooting

### Common Issues

1. **Docker not starting**:
   - Ensure Docker Desktop is running
   - Check Windows virtualization is enabled
   - Try running as Administrator

2. **Tests failing locally**:
   - Run `npx playwright install` to install browsers
   - Check internet connection for app-test.ideoz.ai
   - Verify Node.js version (18+ required)

3. **GitHub Actions failing**:
   - Check repository secrets are set correctly
   - Verify workflow permissions in repository settings
   - Review logs in GitHub Actions tab

4. **Visual regression false positives**:
   - Update baseline screenshots: `npx playwright test --update-snapshots`
   - Check viewport settings in config
   - Consider font rendering differences

### Debug Commands

```bash
# Debug specific test
npx playwright test --debug tests/test/login.spec.js

# Run with trace
npx playwright test --trace on

# Show trace viewer
npx playwright show-trace trace.zip

# Run with browser visible
npx playwright test --headed
```

## 🔄 Workflow Customization

### Adding New Tests

1. Create test file in `tests/test/`
2. Use Page Object Model pattern
3. Follow naming convention: `*.spec.js`
4. Add appropriate test tags for grouping

### Modifying CI/CD

1. Edit workflow files in `.github/workflows/`
2. Adjust triggers, schedules, or environments
3. Add new notification channels
4. Configure additional browsers or devices

### Environment Configuration

1. Update `playwright.config.js` for new environments
2. Add environment-specific settings
3. Configure base URLs and timeouts
4. Set up test data management

## 📈 Performance Optimization

### CI/CD Performance Tips

1. **Use test sharding** for large test suites
2. **Cache dependencies** in workflows
3. **Run critical tests first** with `--grep`
4. **Optimize Docker images** for faster builds
5. **Use matrix strategy** for parallel execution

### Test Performance

1. **Group related tests** in same file
2. **Use beforeAll/afterAll** for expensive setup
3. **Implement test parallelization**
4. **Mock external dependencies** when possible
5. **Use selective test execution** for development

## 🚀 Next Steps

1. **Customize test data**: Add test accounts and data sets
2. **Extend coverage**: Add more pages and user flows
3. **Integrate monitoring**: Add APM tools for production monitoring
4. **Enhance reporting**: Custom dashboards and metrics
5. **Scale testing**: Add more environments and browsers

Your Playwright CI/CD framework is now ready for production use! 🎉