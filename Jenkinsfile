pipeline {
    agent any
    tools {nodejs "node"}
      stages {
          stage('Install') {
              steps {
                  sh "npm install -g yarn"
                  sh "yarn install"
              }
          }
          stage('Unit Test') {
              steps {
                  echo 'testing the unit test'
                  sh 'npm test -- -u'
              }
          }

          stage('Lint test') {
              steps {
                  echo 'testing the eslint'
                  sh 'npx eslint src'
          }
      }
    }
}
