# Doctor AI Backend

RESTful API backend for the Doctor AI Healthcare Platform built with Spring Boot.

## Tech Stack

- **Java 17**
- **Spring Boot 3.2.1**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA** (Hibernate)
- **MySQL / PostgreSQL / H2** (Database)
- **Maven** (Build Tool)
- **Swagger/OpenAPI** (API Documentation)
- **Lombok** (Reduce boilerplate code)

## Features

- ✅ JWT-based Authentication & Authorization
- ✅ Role-based Access Control (Patient, Doctor, Receptionist, Laboratory, Insurance, Admin)
- ✅ RESTful API endpoints
- ✅ API Documentation with Swagger UI
- ✅ Exception Handling
- ✅ Database Integration (MySQL, PostgreSQL, H2)
- ✅ CORS Configuration
- ✅ Health Monitoring (Spring Actuator)
- ✅ Hot Reload (Spring DevTools)

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+ or PostgreSQL (or use H2 for development)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd doctor-ai/backend
```

### 2. Configure Database & Credentials

⚠️ **IMPORTANT: Never commit sensitive credentials to Git!**

**Copy the example configuration file:**

```bash
cp src/main/resources/application-local.yml.example src/main/resources/application-local.yml
```

**Edit `application-local.yml` with your actual credentials:**

```yaml
spring:
  datasource:
    username: your_database_username
    password: your_database_password
  
  mail:
    username: your_email@gmail.com
    password: your_gmail_app_password

jwt:
  secret: your_secure_jwt_secret_key
```

📖 **See [SECURITY.md](SECURITY.md) for detailed setup instructions**

---

### 3. Create Database
    username: your_username
    password: your_password
```

### 3. Build the project

```bash
mvn clean install
```

### 4. Run the application

```bash
mvn spring-boot:run
```

Or run with a specific profile:

```bash
# Development profile (uses H2 database)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Production profile
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

The application will start on `http://localhost:8080/api`

## API Documentation

Once the application is running, access the Swagger UI at:

```
http://localhost:8080/api/swagger-ui.html
```

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/doctorai/
│   │   │       ├── config/           # Configuration classes
│   │   │       ├── controller/       # REST Controllers
│   │   │       ├── dto/              # Data Transfer Objects
│   │   │       ├── exception/        # Custom Exceptions
│   │   │       ├── model/            # Entity Models
│   │   │       ├── repository/       # JPA Repositories
│   │   │       ├── security/         # Security & JWT
│   │   │       ├── service/          # Business Logic
│   │   │       └── DoctorAiApplication.java
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       └── application-prod.yml
│   └── test/
├── pom.xml
└── README.md
```

## Available Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Health Check
- `GET /api/` - API status
- `GET /api/actuator/health` - Health check

## Database Profiles

### Development (H2 In-Memory Database)
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
H2 Console: `http://localhost:8080/api/h2-console`

### Production (MySQL/PostgreSQL)
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## Security

The API uses JWT (JSON Web Token) for authentication. To access protected endpoints:

1. Register or login to get a JWT token
2. Include the token in the Authorization header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

## Default Configuration

- **Server Port**: 8080
- **Context Path**: /api
- **JWT Expiration**: 24 hours
- **Allowed Origins**: http://localhost:5173, http://localhost:3000

## Entity Models

- **User** - Base user entity with roles
- **Patient** - Patient profile information
- **Doctor** - Doctor profile and specialization
- **Appointment** - Appointment scheduling
- **Prescription** - Medical prescriptions
- **Medication** - Prescription medications
- **LabReport** - Laboratory test reports

## Building for Production

```bash
mvn clean package -Pprod
```

The JAR file will be created in the `target/` directory.

Run the JAR:
```bash
java -jar target/doctor-ai-backend-1.0.0.jar
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
