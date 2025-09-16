# Ideoz Auto - Playwright Test Framework

Advanced Playwright Test Framework for Ideoz application with CI/CD integration.

## 🚀 Features

- **Comprehensive Test Coverage**: Login and Registration functionality
- **Page Object Model**: Clean, maintainable test architecture
- **CI/CD Pipeline**: GitHub Actions integration
- **Docker Support**: Containerized test execution
- **Cross-browser Testing**: Chrome, Firefox, Safari, Edge
- **Parallel Execution**: Fast test runs
- **Visual Testing**: Screenshot comparisons
- **Accessibility Testing**: ARIA compliance and keyboard navigation
- **Security Testing**: XSS and SQL injection prevention
- **Performance Testing**: Load time measurements

## 📋 Test Suites

### Login Functionality (25 tests)
- ✅ Core login features
- ✅ Form validation
- ✅ Accessibility compliance
- ✅ Security testing
- ✅ Error handling

### Registration Functionality (22 tests)
- ✅ User registration flow
- ✅ Field validation
- ✅ International character support
- ✅ Password strength indicators
- ✅ Security measures

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- Docker (optional)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Omarsayed92/ideoz-automation-Register-and-login-.git
   cd ideoz-automation-Register-and-login-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

## 🧪 Running Tests

### Local Development
```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Run specific test file
npx playwright test tests/test/login.spec.js

# Run tests with debug
npm run test:debug

# Generate test report
npm run report
```

### Docker Execution
```bash
# Build and run tests in Docker
docker-compose up playwright-tests

# Run with UI (accessible at http://localhost:9323)
docker-compose up playwright-ui

# Run in headed mode
docker-compose up playwright-headed
```

## 📊 Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

Reports include:
- Test execution results
- Screenshots on failures
- Performance metrics
- Accessibility audit results

## 🔧 Configuration

### Playwright Configuration
See `playwright.config.js` for:
- Browser configurations
- Test directories
- Retry strategies
- Reporter settings

### Environment Variables
Create `.env` file for:
```
BASE_URL=https://app-test.ideoz.ai/
CI=false
TIMEOUT=30000
```

## 🏗️ CI/CD Pipeline

### GitHub Actions
The pipeline automatically:
1. **Runs on**: Push to main, Pull Requests
2. **Tests**: All browsers in parallel
3. **Reports**: Publishes HTML reports
4. **Artifacts**: Saves screenshots and videos
5. **Notifications**: Slack/Email alerts on failures

### Pipeline Jobs
- **Test**: Runs full test suite
- **Visual**: Screenshot comparisons
- **Performance**: Load time monitoring
- **Security**: Vulnerability scanning
- **Deploy**: Staging environment updates

## 📁 Project Structure

```
├── tests/
│   ├── pageObjects/          # Page Object Model classes
│   │   ├── LoginPage.js      # Login page interactions
│   │   └── RegistrationPage.js # Registration page interactions
│   └── test/                 # Test specifications
│       ├── login.spec.js     # Login test suite
│       └── registration.spec.js # Registration test suite
├── .github/
│   └── workflows/            # CI/CD pipeline configurations
├── docker-compose.yml        # Docker services
├── Dockerfile               # Container configuration
├── playwright.config.js     # Playwright settings
└── package.json            # Dependencies and scripts
```

## 🐛 Debugging

### Debug Mode
```bash
# Debug specific test
npx playwright test --debug tests/test/login.spec.js

# Debug with browser open
npx playwright test --headed --debug

# Trace viewer
npx playwright show-trace trace.zip
```

### Common Issues
1. **Browser not found**: Run `npx playwright install`
2. **Timeout errors**: Increase timeout in config
3. **Flaky tests**: Enable retry mechanism
4. **Docker issues**: Check Docker Desktop is running

## 📈 Performance Monitoring

Tests include performance metrics:
- Page load times
- Network requests
- Memory usage
- Core Web Vitals

## 🔒 Security Testing

Automated security checks:
- XSS prevention
- SQL injection protection
- CSRF token validation
- Input sanitization

## 🌐 Cross-browser Support

Tested browsers:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari (WebKit)
- ✅ Microsoft Edge

## 📝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For questions or issues:
- Create GitHub issue
- Email: hello@ideoz.ai
- Documentation: hello@ideoz.ai
