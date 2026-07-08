# FatakPay TMS Backend — PostgreSQL Enterprise Edition

## 🚀 Production-Ready Django API Server

This is the **standalone backend repository** for FatakPay TMS with enterprise PostgreSQL architecture. Deploy independently from the frontend.

---

## 📋 Quick Deploy to Kubernetes

### 1. Build & Push Docker Image
```bash
# Build production image
docker build -t fatakpay-tms-backend:latest .

# Tag for your registry
docker tag fatakpay-tms-backend:latest your-registry.com/fatakpay-tms-backend:v1.0.0

# Push to registry  
docker push your-registry.com/fatakpay-tms-backend:v1.0.0
```

### 2. Create Kubernetes Secret
```bash
kubectl create secret generic fatakpay-backend-secrets \
  --from-literal=DB_NAME=fatakpay_tms \
  --from-literal=DB_USER=your_postgres_user \
  --from-literal=DB_PASSWORD=your_postgres_password \
  --from-literal=DB_HOST=your_postgres_host \
  --from-literal=DB_PORT=5432 \
  --from-literal=SECRET_KEY=your-50-character-secret-key \
  --from-literal=ALLOWED_HOSTS=api.yourdomain.com \
  --from-literal=CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### 3. Deploy Backend
```bash
# Apply Kubernetes manifests
kubectl apply -f k8s-backend-deployment.yaml

# Wait for deployment
kubectl rollout status deployment/fatakpay-backend

# Initialize database (one-time)
kubectl exec -it $(kubectl get pods -l app=fatakpay-backend -o jsonpath='{.items[0].metadata.name}') -- python manage.py setup_enterprise_db
```

### 4. Verify Deployment
```bash
# Check health endpoint
curl https://api.yourdomain.com/api/v1/health/

# Expected response: {"status": "healthy", "database": "connected"}
```

---

## 🏗️ Database Architecture

### Enterprise Schema Layout
```
fatakpay_tms (PostgreSQL)
├── identity/    — Users, authentication, JWT tokens
├── core/        — Tickets, departments, comments  
├── ai/          — ML cache, feedback, request logs
├── audit/       — Compliance logs, notifications
└── system/      — Django internals (auto-managed)
```

### Benefits
- **Schema-level security** — Different services access different schemas
- **Backup flexibility** — Dump schemas independently 
- **Multi-tenant ready** — Easy to add client-specific schemas
- **Performance optimized** — Schema-aware search paths

---

## 🔧 Environment Variables

### Required for Production
```env
# Database (PostgreSQL)
DB_NAME=fatakpay_tms
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=your_postgres_host
DB_PORT=5432

# Django Security
SECRET_KEY=your-50-character-random-secret-key
DEBUG=False
ALLOWED_HOSTS=api.yourdomain.com

# CORS (Frontend Integration)
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

### Optional Configuration
```env
# AI Engine (Optional)
AI_SERVICE_ENABLED=True
GROQ_API_KEY=your_groq_api_key

# Email (Optional)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.yourdomain.com

# File Storage (Optional)
USE_S3=False
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

---

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/login/` — User login
- `POST /api/v1/auth/logout/` — User logout
- `POST /api/v1/auth/refresh/` — Refresh JWT token

### Core Features
- `GET /api/v1/tickets/` — List tickets
- `POST /api/v1/tickets/` — Create ticket
- `GET /api/v1/departments/` — List departments
- `GET /api/v1/users/` — List users

### AI Features  
- `POST /api/v1/ai/analyze/` — AI ticket analysis
- `POST /api/v1/ai/suggest/` — Resolution suggestions
- `POST /api/v1/ai/chat/` — AI chat interface

### Health & Monitoring
- `GET /api/v1/health/` — Health check
- `GET /api/v1/reports/stats/` — System statistics

---

## 🐳 Docker Configuration

### Dockerfile Features
- **Multi-stage build** — Optimized 216MB image size
- **Non-root user** — Security best practices
- **Auto schema creation** — No manual setup required
- **Health checks** — Kubernetes-ready monitoring
- **Static files** — WhiteNoise for production serving

### Container Startup Process
1. Creates PostgreSQL schemas automatically
2. Runs Django migrations  
3. Collects static files
4. Starts Gunicorn with 3 workers
5. Health check available at `/api/v1/health/`

---

## 🔒 Security Features

### Application Security
- JWT authentication with token blacklist
- CORS protection for frontend integration
- SQL injection prevention via Django ORM
- XSS protection with security middleware
- CSRF protection for state-changing operations

### Database Security
- Schema-level access control
- Connection pooling with timeouts
- Prepared statements (SQL injection prevention)
- Audit logging for all operations

---

## 📈 Production Considerations

### Scaling
```yaml
# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: fatakpay-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: fatakpay-backend
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Monitoring
- Health endpoint: `/api/v1/health/`
- Metrics endpoint: `/api/v1/metrics/` (optional)
- Log level: Configurable via `LOG_LEVEL` environment variable
- Structured JSON logging for production

### Database Performance
- Connection pooling enabled (600s max age)
- Schema-based search path optimization
- Indexing on critical fields (status, priority, created_at)
- Query optimization via Django Debug Toolbar (dev only)

---

## 🛠️ Management Commands

### Database Setup
```bash
# Create schemas and run migrations
python manage.py setup_enterprise_db --skip-seed

# Create schemas and load sample data  
python manage.py setup_enterprise_db

# Load sample data only
python manage.py seed_data
```

### Data Management
```bash
# Clear all data and reseed
python manage.py seed_data --clear

# Create test users
python manage.py create_test_users

# Generate reports
python manage.py generate_reports
```

### Maintenance
```bash
# Check system health
python manage.py check --deploy

# Verify database connections
python manage.py dbshell

# Collect static files
python manage.py collectstatic --noinput
```

---

## 🧪 Testing

### Local Testing
```bash
# Run all tests
python manage.py test

# Test with coverage
coverage run --source='.' manage.py test
coverage report -m

# Test specific app
python manage.py test tickets
```

### Docker Testing  
```bash
# Test Docker build
docker build -t fatakpay-backend-test .

# Test container
docker run --rm \
  -e DB_HOST=your_test_db \
  -e DB_NAME=test_db \
  fatakpay-backend-test \
  python manage.py test
```

---

## 📞 Support & Documentation

### Sample Data
After running `setup_enterprise_db`, you get:
- **1 Super Admin:** admin@fatakpay.com / Admin@1234
- **12 Department Heads:** *.sharma@fatakpay.com / Head@1234  
- **48 Team Members:** Various roles / Member@1234 or Caller@1234
- **72 Sample Tickets:** Across all departments with realistic data

### Troubleshooting
- **Pod won't start:** Check `kubectl logs <pod-name>`
- **Database issues:** Verify connection with `kubectl exec <pod> -- python manage.py dbshell`
- **Schema problems:** Re-run `setup_enterprise_db --skip-seed`

### Frontend Integration
This backend expects frontend requests from origins listed in `CORS_ALLOWED_ORIGINS`.
API responses include proper CORS headers for seamless frontend integration.

---

## 🎯 Production Deployment Checklist

- [ ] PostgreSQL instance configured and accessible
- [ ] Docker image built and pushed to registry
- [ ] Kubernetes secrets created with production credentials
- [ ] CORS origins configured for frontend domains
- [ ] Health checks responding at `/api/v1/health/`
- [ ] Database schemas created via `setup_enterprise_db`
- [ ] SSL/TLS termination configured (LoadBalancer/Ingress)
- [ ] Monitoring and logging configured
- [ ] Backup strategy implemented for PostgreSQL

---

**🚀 Ready for independent backend deployment!**