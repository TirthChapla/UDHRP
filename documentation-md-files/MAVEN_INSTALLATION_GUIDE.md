# Quick Maven Installation Guide for Windows

## Why Maven is Needed

Maven is a build automation tool that:
- Compiles Java code
- Manages dependencies (libraries)
- Runs the Spring Boot application
- Without it, we can't start the backend

## Easiest Method: Automatic (If you have Chocolatey or WinGet)

### Option 1: Chocolatey
```bash
# If Chocolatey is installed
choco install maven

# Verify
mvn -version
```

### Option 2: Windows Package Manager
```bash
# If Windows 11 or WinGet is installed
winget install Maven.Maven

# Verify  
mvn -version
```

## Manual Installation (Always Works)

### Step 1: Download Maven
1. Go to: https://maven.apache.org/download.cgi
2. Download: **Binary zip archive** (NOT source)
   - File name: `apache-maven-3.9.x-bin.zip`

### Step 2: Extract Maven
1. Extract the zip file to a simple path, e.g.:
   ```
   C:\Apache\maven
   ```
   
   OR
   
   ```
   C:\Program Files\Maven
   ```

### Step 3: Add Maven to Windows PATH

**Using GUI (Easiest):**
1. Open **File Explorer**
2. Right-click **"This PC"** → **"Properties"**
3. Click **"Advanced system settings"** (or search for "environment variables")
4. Click **"Environment Variables"** button
5. Under **"System variables"**, click **"New"**
   - Variable name: `MAVEN_HOME`
   - Variable value: `C:\Apache\maven` (or wherever you extracted)
6. Click OK
7. In System variables, find **"Path"** and click **"Edit"**
8. Click **"New"** and add: `%MAVEN_HOME%\bin`
9. Click OK → OK → OK
10. **Close all command prompts and restart them**

**Using Command Prompt (PowerShell as Admin):**
```powershell
# Set MAVEN_HOME
[Environment]::SetEnvironmentVariable("MAVEN_HOME", "C:\Apache\maven", "Machine")

# Add to PATH (requires restart)
```

### Step 4: Verify Installation
Open a **new** Command Prompt or PowerShell and run:
```bash
mvn -version
```

**Expected output:**
```
Apache Maven 3.9.x
...
Java version: 17.0.x
```

If you see version numbers, Maven is installed correctly! ✅

## Troubleshooting Maven Installation

### "mvn is not recognized"
**Solution**: 
- You didn't restart command prompt after adding to PATH
- Close ALL terminals and open a new one
- Or manually add path and restart PC

### "MAVEN_HOME not set"
**Solution**:
```bash
# Set it temporarily in current session
set MAVEN_HOME=C:\Apache\maven
set PATH=%PATH%;%MAVEN_HOME%\bin

# Verify
mvn -version
```

### "Java not recognized"
Maven needs Java. Ensure Java 17+ is installed:
```bash
java -version
```

If not, install from: https://adoptium.net/

## After Maven is Installed

### Start the Backend
```bash
cd "E:\PROJECTS\Doctor AI\doctor-ai\backend"

mvn clean spring-boot:run -Dspring-boot.run.profiles=local
```

### First Run Takes Longer
- Maven downloads ~500MB of dependencies
- Subsequent runs are much faster
- You'll see lots of download messages - this is normal

### Success Indicators
```
[INFO] Building Doctor AI Backend...
[INFO] 
[INFO] --- maven-resources-plugin:3.x.x:resources (default-resources) @ doctor-ai-backend ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
...
[INFO] Tomcat initialized with port 8080 (http)
[INFO] Started DoctorAiApplication in 5.xxx seconds
```

Then backend is running at: `http://localhost:8080/api`

## Video Tutorial Alternative

If you prefer visual instructions:
- Search YouTube for: "Maven installation Windows"
- Follow the setup steps shown

## Next Steps After Maven Installation

1. **Verify Backend Starts**
   ```bash
   cd "E:\PROJECTS\Doctor AI\doctor-ai\backend"
   mvn clean spring-boot:run -Dspring-boot.run.profiles=local
   ```

2. **Test Backend Health**
   - Open browser: `http://localhost:8080/api/health`
   - Should return: `{"status":"UP"}`

3. **Run Frontend**
   ```bash
   cd "E:\PROJECTS\Doctor AI\doctor-ai\frontend"
   npm run dev
   ```

4. **Test Lab Report Creation**
   - Navigate to Doctor Prescription
   - Select patient
   - Add lab reports
   - Submit and verify no errors

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| mvn not found after installation | Restart terminal/IDE |
| "Java not found" | Install Java 17+ from adoptium.net |
| Slow first build | Normal - Maven downloading ~500MB |
| Port 8080 already in use | Change port or kill process |
| Out of memory during build | Increase heap: `MAVEN_OPTS=-Xmx1024m` |

## Getting Help

If Maven still won't work:
1. Check Maven installation exists: `C:\Apache\maven\bin\mvn.cmd`
2. Check PATH: Open CMD and type `echo %MAVEN_HOME%`
3. Try setting manually in terminal:
   ```bash
   set MAVEN_HOME=C:\Apache\maven
   set PATH=%PATH%;%MAVEN_HOME%\bin
   mvn -version
   ```

## Time Estimate

- Manual download and extract: **5-10 minutes**
- Add to PATH: **2-3 minutes**  
- First build: **10-15 minutes** (downloads dependencies)
- Subsequent builds: **30 seconds - 2 minutes**

**Total setup time: ~20-30 minutes first time, then ~1 minute to start**

---

Once Maven is installed, run:
```bash
cd "E:\PROJECTS\Doctor AI\doctor-ai\backend"
mvn clean spring-boot:run -Dspring-boot.run.profiles=local
```

Backend will start and all frontend issues related to "lab report creation failed" will be resolved! ✅
