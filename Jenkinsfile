pipeline {
  agent any
  stages {
    stage('Check dependencies') {
      agent {
        docker {
          image 'node:8'
        }

      }
      steps {
        sh 'npm install'
        echo 'Everything is okay, we can continue !'
      }
    }
    stage('Build') {
      parallel {
        stage('Build dev') {
          when {
            branch "dev"
          }
          steps {
            sh 'docker build -t eirbmon/back-dev .'
            echo 'Docker dev image built'
          }
        }
        stage('Build prod') {
          when {
            branch "master"
          }
          steps {
            sh 'docker build -t eirbmon/back .'
            echo 'Docker prod image built'
          }
        }
        stage('Stop old dev') {
          when {
            branch "dev"
          }
          steps {
            sh 'docker stop eirbmon-back-dev || true'
            sh 'docker rm eirbmon-back-dev || true'
            sh 'docker rmi eirbmon/back-dev || true'
            echo 'Old dev container stopped'
          }
        }
        stage('Stop old prod') {
          when {
            branch "master"
          }
          steps {
            sh 'docker stop eirbmon-back || true'
            sh 'docker rm eirbmon-back || true'
            sh 'docker rmi eirbmon/back || true'
            echo 'Old prod container stopped'
          }
        }
      }
    }
        stage('Run dev container') {
          when {
            branch "dev"
          }
          steps {
            sh 'docker run --network="host" -it -v /home/eirbmon/Documents/SharedFileDev:/Blockchain/build/contracts -d --name eirbmon-back-dev eirbmon/back-dev'
            echo 'Dev container ready !'
          }
        }
        stage('Run prod container') {
          when {
              branch "master"
          }
          steps {
            sh 'docker run --network="host" -it -v /home/eirbmon/Documents/SharedFile:/Blockchain/build/contracts -d --name eirbmon-back eirbmon/back'
            echo 'Prod container ready !'
          }
    }
  }
}