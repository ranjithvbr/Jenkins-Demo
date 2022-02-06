pipeline {
    agent any
    tools {nodejs "node"}
      stages {
          stage('build') {
              steps {
                  sh "npm install -g yarn"
                  sh "yarn install"
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
