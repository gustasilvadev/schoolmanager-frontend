pipeline {
    agent any
    stages {
        stage('Verificar Repositório') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/main']], useRemoteConfigs: [[url: 'https://github.com/Gustasilvadev/schoolManager-frontend']]])
            }
        }

        stage('Instalar Dependências') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Construir Imagem Docker') {
            steps {
                script {
                    def appName = 'schoolmanager-frontend'
                    def imageTag = "${appName}:${env.BUILD_ID}"

                    sh "docker build -t ${imageTag} ."
                }
            }
        }

        stage('Fazer Deploy') {
            steps {
                script {
                    def appName = 'schoolmanager-frontend'
                    def imageTag = "${appName}:${env.BUILD_ID}"

                    sh "docker stop ${appName} || true"
                    sh "docker rm -v ${appName} || true"
                    sh "docker run -d --name ${appName} -p 9518:9518 ${imageTag}"
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
