# Backend Setup and Troubleshooting Guide

## Current Issue

The backend failed to start with error:
```
Could not resolve placeholder 'jwt.secret' in value "${jwt.secret}"
```

**Status**: ✅ FIXED - JWT secret now has a default value in `application.yml`

## Solution Applied

Updated `application.yml` to include a default JWT secret:
```yaml
jwt:
  secret: ${JWT_SECRET:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}
  expiration: ${JWT_EXPIRATION:86400000}
```

This allows the backend to start even if the environment variable `JWT_SECRET` is not set.

## Prerequisites to Run Backend

### 1. Install Java 17 or Higher
```bash
# Check Java version
java -version

# Should output: Java version 17 or higher
```

### 2. Install Maven
Maven is required to build and run the Spring Boot application.

**Option A: Download and Install Manually**
1. Download from: https://maven.apache.org/download.cgi
2. Extract to a location (e.g., `C:\Program Files\Apache\maven`)
3. Add to Windows PATH:
   - Right-click "This PC" → Properties
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Add new system variable:
     - Name: `MAVEN_HOME`
     - Value: `C:\Program Files\Apache\maven`
   - Edit PATH and add: `%MAVEN_HOME%\bin`
   - Restart command prompt and verify: `mvn -v`

**Option B: Use Chocolatey (if installed)**
```bash
choco install maven
```

**Option C: Use Windows Package Manager**
```bash
winget install Maven.Maven
```

### 3. Verify Maven Installation
```bash
mvn -version

# Should output Maven version 3.6+ and Java version 17+
```

## Starting the Backend

### Method 1: Using the Batch Script (Windows)
```bash
# Navigate to backend directory and run the script
E:\PROJECTS\Doctor AI\doctor-ai\backend\start-backend.bat
```

### Method 2: Manual Command
```bash
# From backend directory
cd "E:\PROJECTS\Doctor AI\doctor-ai\backend"

# Clean build and run with local profile
mvn clean spring-boot:run -Dspring-boot.run.profiles=local
```

### Method 3: IDE (IntelliJ, VS Code, etc.)
Most IDEs have built-in Maven support. Right-click on `pom.xml` and select "Run" or "Debug".

## Expected Output When Backend Starts Successfully

```
2026-01-09 14:30:33 - Starting DoctorAiApplication using Java 22.0.1...
2026-01-09 14:30:34 - Bootstrapping Spring Data JPA repositories in DEFAULT mode.
2026-01-09 14:30:34 - Finished Spring Data repository scanning...
2026-01-09 14:30:34 - Tomcat initialized with port 8080 (http)
2026-01-09 14:30:35 - H2 console available at '/h2-console'
2026-01-09 14:30:35 - Started DoctorAiApplication in 2.xxx seconds (JVM running for x.xxx)
```

✅ Backend is running on: `http://localhost:8080/api`

## Verify Backend is Working

### Check Health Endpoint
```bash
# Open in browser or terminal
curl http://localhost:8080/api/health

# Should respond with:
# {"status":"UP"}
```

### Check Swagger Documentation
```
http://localhost:8080/api/swagger-ui.html
```

## Configuration Files

### application.yml (Default)
- Location: `src/main/resources/application.yml`
- Contains: Default configuration with environment variable support
- JWT Secret: Now has a fallback default value
- Database: Configured for MySQL with H2 fallback

### application-local.yml (Local Development)
- Location: `src/main/resources/application-local.yml`
- Contains: Sensitive credentials (NOT committed to Git)
- Override: Values in this file override `application.yml`
- Must have: Database username/password, Mail credentials, JWT secret (optional, uses default)

## Troubleshooting

### Error: "mvn" is not recognized
**Solution**: Maven is not installed or not in PATH
- Follow installation instructions above
- After installing, restart your terminal/IDE
- Verify with: `mvn -version`

### Error: Cannot find Java
**Solution**: Java is not installed or not in PATH
- Install Java 17+ from: https://adoptium.net/
- Add JAVA_HOME environment variable
- Restart terminal and verify: `java -version`

### Error: Failed to connect to database
**Solution**: Ensure database is running
- The app uses H2 in-memory database by default
- Or configure MySQL if preferred in `application-local.yml`

### Error: Could not resolve placeholder 'jwt.secret'
**Status**: ✅ FIXED in latest version
- The JWT secret now has a default value
- No action needed

### Error: Port 8080 already in use
**Solution**: Change port or kill process using it
```bash
# Option 1: Change port in application.yml
server:
  port: 8081

# Option 2: Find and kill process using port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Backend crashes after starting
**Check logs for**:
- Missing dependencies
- Configuration issues
- Database connection problems
- Run with debug enabled: `mvn spring-boot:run -Dspring-boot.run.arguments="--debug"`

## Frontend Configuration

Ensure frontend is configured to use the correct backend URL:
- Location: `frontend/src/services/api.js`
- Default: `http://localhost:8080/api`
- Update if using different port/host

## Database Setup

### H2 Console (Default)
- URL: `http://localhost:8080/api/h2-console`
- JDBC URL: `jdbc:h2:mem:...` (check console output)
- Username: `sa`
- Password: (empty)

### MySQL Setup (Optional)
If using MySQL instead of H2:

1. Install MySQL Server 8.0+
2. Create database:
```sql
CREATE DATABASE doctor_ai_db;
```

3. Update `application-local.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/doctor_ai_db?createDatabaseIfNotExist=true
    username: root
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver
```

4. Restart backend

## Quick Start Summary

```bash
# 1. Install Maven and Java 17+

# 2. Navigate to backend
cd "E:\PROJECTS\Doctor AI\doctor-ai\backend"

# 3. Start backend
mvn clean spring-boot:run -Dspring-boot.run.profiles=local

# 4. Verify running at http://localhost:8080/api/health

# 5. Frontend should automatically connect to backend
```

## Next Steps

Once backend is running:

1. **Test Lab Report Creation**
   - Go to Doctor Prescription page
   - Select a patient
   - Add lab reports with dropdown selections
   - Submit prescription
   - Check console for log messages

2. **Monitor Logs**
   - Watch terminal for `[DoctorPrescription]` and `[doctorService]` logs
   - These show the request/response flow

3. **Debug Issues**
   - If lab report creation fails, check:
     - Backend logs for error messages
     - Browser console for detailed error
     - Network tab in DevTools to see API response

4. **Check Database**
   - Visit H2 console: `http://localhost:8080/api/h2-console`
   - Run SQL: `SELECT * FROM lab_reports;`
   - Verify lab reports are created with proper IDs

## Support Commands

```bash
# Clean build
mvn clean install

# Build without running
mvn clean package

# Run with debug logging
mvn -X spring-boot:run -Dspring-boot.run.profiles=local

# Run with specific port
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8081"

# Run in background (PowerShell)
Start-Process "powershell" -ArgumentList 'mvn spring-boot:run -Dspring-boot.run.profiles=local'

# Stop process
# Either: Ctrl+C in terminal
# Or: Kill the Java process using netstat/taskkill
```

## Important Notes

⚠️ **Credentials**
- `application-local.yml` contains sensitive data
- NEVER commit this file to Git
- It's already in `.gitignore`

⚠️ **JWT Secret**
- Default value is provided: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
- Change this in production!
- Can override with `JWT_SECRET` environment variable

⚠️ **Database**
- H2 is for development only
- Use MySQL/PostgreSQL for production
- Data is lost when application stops (H2 in-memory)

## Success Indicators

✅ Backend starts without errors
✅ Can access http://localhost:8080/api/health
✅ Lab reports creation works and returns ID
✅ Prescription creation includes lab report IDs
✅ Database queries show lab_reports and prescriptions tables linked by ID
