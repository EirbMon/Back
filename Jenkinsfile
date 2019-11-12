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
        stage('Build prod') {
          steps {
            sh 'docker build -t eirbmon/back .'
            echo 'Docker prod image built'
          }
        }
        stage('Stop old prod') {
          steps {
            sh 'docker stop eirbmon-back || true'
            sh 'docker rm eirbmon-back || true'
            sh 'docker rmi eirbmon/back || true'
            echo 'Old prod container stopped'
          }
        }
      }
    }
    stage('Run prod container') {
      steps {
        sh 'docker run --network="host" -it -v /home/eirbmon/Documents/SharedFile:/Blockchain/build/contracts -d --name eirbmon-back eirbmon/back'
        echo 'Prod container ready !'
      }
    }
  }
}