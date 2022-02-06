pipeline {
    agent any
    tools {nodejs "node"}
      stages {
          stage('Build') {
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

          stage('Eslint test') {
              steps {
                  echo 'testing the eslint'
                  sh 'npx eslint src'
          }
      }
    }
}
