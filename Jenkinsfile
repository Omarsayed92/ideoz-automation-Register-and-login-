pipeline {
    agent any

    parameters {
        choice(name: 'ENV', choices: ['dev', 'staging', 'prod'], description: 'Select environment to run tests against')
        choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'], description: 'Select browser to run tests')
        string(name: 'TAGS', defaultValue: '@smoke', description: 'Specify test tags to run (e.g., @smoke, @regression)')
    }

    environment {
        NODE_VERSION = '18'
    }

    stages {
        stage('Setup') {
            steps {
                nodejs(nodeJSInstallationName: "Node ${NODE_VERSION}") {
                    sh 'npm ci'
                    sh 'npx playwright install ${BROWSER}'
                }
            }
        }

        stage('Run Tests') {
            steps {
                nodejs(nodeJSInstallationName: "Node ${NODE_VERSION}") {
                    sh """
                        ENV=${params.ENV} npm run test -- --project=${params.BROWSER} --grep="${params.TAGS}"
                    """
                }
            }
        }
    }

    post {
        always {
            publishHTML(target: [
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
            junit 'test-results/junit-report.xml'
            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
        }
    }
}