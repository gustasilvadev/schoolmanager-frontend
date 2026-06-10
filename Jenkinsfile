pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/main']], useRemoteConfigs: [[url: 'https://github.com/Gustasilvadev/schoolManager-frontend']]])
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    def imageTag = "schoolmanager-frontend:${env.BUILD_ID}"
                    sh "docker build -t ${imageTag} ."
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    def appName = 'schoolmanager-frontend'
                    def imageTag = "${appName}:${env.BUILD_ID}"

                    sh "docker stop ${appName} || true"
                    sh "docker rm -v ${appName} || true"
                    sh "docker run -d --name ${appName} -p 9518:9518 --env-file .env ${imageTag}"
                }
            }
        }
    }

    post {
        success {
            echo 'Deploy realizado com sucesso!'
        }
        failure {
            echo 'Houve um erro durante o deploy.'
        }
    }
}
