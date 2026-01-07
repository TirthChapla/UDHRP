# Security Configuration Guide

## 🔒 Protecting Sensitive Information

This project follows industry best practices to keep sensitive credentials secure and **NOT** commit them to Git.

---

## Setup Instructions for Developers

### 1. Create Local Configuration File

Copy the example configuration file:

```bash
cp src/main/resources/application-local.yml.example src/main/resources/application-local.yml
```

### 2. Add Your Credentials

Edit `application-local.yml` and replace placeholder values with your actual credentials:

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

### 3. Gmail App Password Setup

For SMTP authentication:

1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Generate App Password: https://myaccount.google.com/apppasswords
4. Use the generated 16-character password in `application-local.yml`

---

## Configuration Priority

Spring Boot loads configuration in this order (later overrides earlier):

1. `application.yml` (Base configuration, no secrets)
2. `application-local.yml` (Local development with secrets - **git-ignored**)
3. Environment variables (Production deployment)

---

## Production Deployment

### Using Environment Variables

Set these environment variables in your production environment:

```bash
# Database
export DB_URL=jdbc:mysql://production-host:3306/doctor_ai_db
export DB_USERNAME=prod_user
export DB_PASSWORD=secure_password

# Email
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=587
export MAIL_USERNAME=production@email.com
export MAIL_PASSWORD=app_password

# JWT
export JWT_SECRET=production_secret_key_256_bits
export JWT_EXPIRATION=86400000

# Application
export APP_BASE_URL=https://api.yourdomain.com
export APP_FRONTEND_URL=https://yourdomain.com
export ALLOWED_ORIGINS=https://yourdomain.com

# Profile
export SPRING_PROFILES_ACTIVE=prod
```

### Using application-prod.yml (Optional)

Create `application-prod.yml` for production-specific settings (non-sensitive):

```yaml
spring:
  jpa:
    show-sql: false
    hibernate:
      ddl-auto: validate

logging:
  level:
    com.doctorai: INFO
```

---

## Security Checklist

- ✅ **application-local.yml** is git-ignored
- ✅ Never commit passwords, API keys, or secrets
- ✅ Use environment variables in production
- ✅ Rotate JWT secrets regularly
- ✅ Use strong, randomly generated secrets (256-bit minimum)
- ✅ Enable 2FA on all service accounts
- ✅ Use App Passwords instead of regular passwords
- ✅ Keep `.gitignore` up to date

---

## Files That Are Git-Ignored

The following files contain sensitive data and are **NOT** committed to Git:

- `**/application-local.yml`
- `**/application-secrets.yml`
- `.env`
- `*.env`
- Any file matching `**/*-local.*` or `**/*-secrets.*`

---

## Need Help?

If you accidentally committed sensitive data:

1. **Immediately rotate all exposed credentials**
2. Remove from Git history:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch path/to/file" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. Force push (⚠️ coordinate with team):
   ```bash
   git push origin --force --all
   ```

---

## Additional Resources

- [Spring Boot Externalized Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [12-Factor App: Config](https://12factor.net/config)
