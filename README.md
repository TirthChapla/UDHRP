# Full Stack Deployment (React + Spring Boot + MySQL on AWS EC2)

Production-style deployment using:

- React (Frontend)
- Spring Boot (Backend API)
- MySQL (same EC2 instance)
- Nginx (Reverse Proxy)
- Docker and Docker Compose
- GitHub Actions CI/CD
- AWS EC2 (t3.small recommended)

---

## Architecture

Users
  |
  v
Nginx (port 80)
  |
  +--> React Frontend (container)
  |
  +--> Spring Boot Backend (container)
           |
           v
        MySQL (container)

Everything runs on a single EC2 instance to keep costs low.

---

## Project Structure

project-root/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── frontend/
│   └── Dockerfile
├── backend/
│   └── Dockerfile
├── nginx/
│   └── default.conf
├── docker-compose.yml
└── README.md

---

## 1. EC2 Setup (run once)

Launch EC2:

- Ubuntu 22.04
- t3.small instance
- Open ports: 22 (SSH), 80 (HTTP)

SSH into EC2:

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
```

Update system:

```bash
sudo apt update && sudo apt upgrade -y
```

Install Docker and Compose plugin:

```bash
sudo apt install docker.io docker-compose-plugin -y
sudo systemctl enable docker
sudo systemctl start docker
```

Allow docker without sudo:

```bash
sudo usermod -aG docker ubuntu
newgrp docker
```

Install Git:

```bash
sudo apt install git -y
```

---

## 2. Frontend Dockerfile

[frontend/Dockerfile](frontend/Dockerfile)

```Dockerfile
FROM node:18

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build
RUN npm install -g serve

CMD ["serve", "-s", "build", "-l", "3000"]
```

---

## 3. Backend Dockerfile

[backend/Dockerfile](backend/Dockerfile)

```Dockerfile
FROM eclipse-temurin:17-jdk

WORKDIR /app
COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 4. Nginx Reverse Proxy

[nginx/default.conf](nginx/default.conf)

```nginx
server {
    listen 80;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://backend:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 5. Docker Compose

[docker-compose.yml](docker-compose.yml)

```yaml
version: "3.8"

services:
  mysql:
    image: mysql:8
    container_name: mysql_db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: appdb
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - app-network

  backend:
    build: ./backend
    container_name: spring_backend
    restart: always
    depends_on:
      - mysql
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/appdb
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: rootpassword
    networks:
      - app-network

  frontend:
    build: ./frontend
    container_name: react_frontend
    restart: always
    networks:
      - app-network

  nginx:
    image: nginx:latest
    container_name: nginx_proxy
    ports:
      - "80:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - frontend
      - backend
    networks:
      - app-network

networks:
  app-network:

volumes:
  mysql_data:
```

---

## 6. First Manual Deployment

Clone repo on EC2:

```bash
git clone YOUR_REPO_URL
default_dir=$(basename "YOUR_REPO_URL" .git)
cd "$default_dir"
```

Build Spring Boot JAR:

```bash
cd backend
./mvnw clean package -DskipTests
cd ..
```

Start services:

```bash
docker compose up -d --build
```

Check containers:

```bash
docker ps
```

Open browser:

```
http://YOUR_EC2_PUBLIC_IP
```

---

## 7. CI/CD with GitHub Actions

### Step A: Create SSH key (local machine)

```bash
ssh-keygen -t rsa -b 4096 -C "github-actions"
```

Copy public key:

```bash
cat id_rsa.pub
```

Paste into EC2:

```bash
nano ~/.ssh/authorized_keys
```

### Step B: GitHub Secrets

Add in GitHub: Settings -> Secrets -> Actions

- EC2_HOST: EC2 public IP
- EC2_USER: ubuntu
- EC2_SSH_KEY: content of id_rsa

### Step C: CI/CD Workflow

If your repo folder name is not `doctor-ai`, update the `cd doctor-ai` line in the workflow.

[.github/workflows/deploy.yml](.github/workflows/deploy.yml)

```yaml
name: Deploy to EC2

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy over SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            set -e
            cd doctor-ai
            git pull origin main

            cd backend
            ./mvnw clean package -DskipTests
            cd ..

            docker compose down
            docker compose up -d --build
            docker image prune -f
```

---

## Deployment Flow (what happens on each push)

1. You push code to GitHub.
2. GitHub Actions triggers automatically.
3. Workflow connects to EC2 via SSH.
4. Latest code is pulled.
5. Spring Boot JAR is rebuilt.
6. Docker containers restart with the new build.
7. New version goes live.

---

## 8. MySQL Backup

Create backup:

```bash
docker exec mysql_db mysqldump -u root -prootpassword appdb > backup.sql
```

Copy backup to local:

```bash
scp -i your-key.pem ubuntu@YOUR_EC2_IP:~/backup.sql .
```

---

## 9. Future ML Integration (ready)

Later add:

```
ml-service/
```

And in docker-compose:

```yaml
ml-service:
  build: ./ml-service
```

Backend can call the ML API internally.

---

## Estimated Monthly Cost

- EC2 t3.small: ~15 USD
- Storage: ~1 to 2 USD
- Total: ~16 to 18 USD

---

## Simple Explanation

You now have a setup where:

- Code lives in GitHub
- Every push automatically deploys to EC2
- Nginx routes traffic correctly
- Docker keeps environments consistent
- MySQL data stays persistent on the server
- Future ML model can be added as another container without changing architecture
