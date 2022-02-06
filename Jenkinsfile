pipeline {
    agent any

    tools {nodejs "nodejs"}

      stages {
          stage('build') {
              steps {
                  echo 'building the software'
                  sh 'npm install'
              }
          }
          stage('test') {
              steps {
                  echo 'testing the software'
                  sh 'npm run test'
              }
          }

          stage('lint-test') {
              steps {
                  echo 'testing the software'
                  sh 'npx eslint src'
          }
      }
    }
}
