# FatakPay TMS Backend Deployment Guide

## 🚀 Quick Start Deployment

### Local Development
```bash
# 1. Clone and setup
git clone <your-repo>/fatakpay-tms-backend
cd fatakpay-tms-backend
make setup-dev

# 2. Start development server
make run
# Backend available at: http://localhost:8000
```

### Docker Development
```bash
# 1. Start with Docker Compose
make docker-run

# 2. View logs
make docker-logs

# 3. Clean up
make docker-clean
```

### Production Kubernetes
```bash
# 1. Configure environment
make setup-prod
# Edit .env.production with your settings

# 2. Deploy to Kubernetes
make deploy

# 3. Verify deployment
make verify
```

---

## 📋 Detailed Production Deployment

### Prerequisites
- Kubernetes cluster (1.19+)
- PostgreSQL database (12+)
- Docker registry access
- kubectl configured
- Domain name for API access

### Step 1: Database Setup

#### Option A: Managed PostgreSQL (Recommended)
```bash
# AWS RDS, Google Cloud SQL, Azure Database, etc.
# Create database: fatakpay_tms
# Note connection details for configuration
```

#### Option B: Self-hosted PostgreSQL
```yaml
# k8s-postgres.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:16
        env:
        - name: POSTGRES_DB
          value: fatakpay_tms
        - name: POSTGRES_USER
          value: fatakpay_user
        - name: POSTGRES_PASSWORD
          value: secure_password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 100Gi
```

### Step 2: Environment Configuration

Create production environment file:
```bash
cp .env.production.example .env.production
```

Configure required variables:
```env
# Database
DB_NAME=fatakpay_tms
DB_USER=your_user
DB_PASSWORD=your_secure_password
DB_HOST=your_postgres_host
DB_PORT=5432

# Django
SECRET_KEY=your-50-character-random-secret-key
DEBUG=False
ALLOWED_HOSTS=api.yourdomain.com

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Optional: AI Features
GROQ_API_KEY=your_groq_api_key

# Optional: Email
EMAIL_HOST=smtp.yourdomain.com
EMAIL_HOST_USER=noreply@yourdomain.com
EMAIL_HOST_PASSWORD=your_email_password

# Optional: File Storage
USE_S3=True
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_STORAGE_BUCKET_NAME=fatakpay-files
```

### Step 3: Create Kubernetes Secrets

```bash
# Create secrets from environment file
kubectl create secret generic fatakpay-backend-secrets \
  --from-env-file=.env.production \
  --namespace=production
```

### Step 4: Build and Push Docker Image

```bash
# Build image
docker build -t fatakpay-tms-backend:v1.0.0 .

# Tag for registry
docker tag fatakpay-tms-backend:v1.0.0 your-registry.com/fatakpay-tms-backend:v1.0.0

# Push to registry
docker push your-registry.com/fatakpay-tms-backend:v1.0.0
```

### Step 5: Deploy to Kubernetes

Update image in deployment file:
```yaml
# k8s-backend-deployment.yaml
spec:
  template:
    spec:
      containers:
      - name: backend
        image: your-registry.com/fatakpay-tms-backend:v1.0.0
```

Deploy:
```bash
# Apply deployment
kubectl apply -f k8s-backend-deployment.yaml -n production

# Wait for rollout
kubectl rollout status deployment/fatakpay-backend -n production
```

### Step 6: Initialize Database

```bash
# Get pod name
POD_NAME=$(kubectl get pods -l app=fatakpay-backend -n production -o jsonpath='{.items[0].metadata.name}')

# Initialize database
kubectl exec -it $POD_NAME -n production -- python manage.py setup_enterprise_db

# Verify tables created
kubectl exec -it $POD_NAME -n production -- python manage.py shell -c "
from django.db import connection
cursor = connection.cursor()
cursor.execute('SELECT schemaname, COUNT(*) FROM pg_tables WHERE schemaname IN (\'identity\', \'core\', \'ai\', \'audit\') GROUP BY schemaname')
for row in cursor.fetchall():
    print(f'{row[0]}: {row[1]} tables')
"
```

### Step 7: Configure DNS and SSL

#### DNS Configuration
```bash
# Get external IP
kubectl get ingress fatakpay-backend-ingress -n production

# Configure DNS record
# api.yourdomain.com → <EXTERNAL_IP>
```

#### SSL Certificate (Let's Encrypt)
```yaml
# ssl-cert.yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: fatakpay-backend-tls
  namespace: production
spec:
  secretName: fatakpay-backend-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
  - api.yourdomain.com
```

### Step 8: Verify Deployment

```bash
# Run verification script
./verify-deployment.sh

# Test API endpoints
curl https://api.yourdomain.com/api/v1/health/
curl https://api.yourdomain.com/api/v1/auth/login/ -X POST
```

---

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DB_NAME` | PostgreSQL database name | Yes | - |
| `DB_USER` | Database user | Yes | - |
| `DB_PASSWORD` | Database password | Yes | - |
| `DB_HOST` | Database host | Yes | - |
| `DB_PORT` | Database port | No | 5432 |
| `SECRET_KEY` | Django secret key | Yes | - |
| `DEBUG` | Debug mode | No | False |
| `ALLOWED_HOSTS` | Allowed host names | Yes | - |
| `CORS_ALLOWED_ORIGINS` | Frontend URLs | Yes | - |

### Resource Requirements

| Component | CPU Request | Memory Request | CPU Limit | Memory Limit |
|-----------|-------------|----------------|-----------|--------------|
| Backend Pod | 250m | 512Mi | 500m | 1Gi |
| PostgreSQL | 500m | 1Gi | 1000m | 2Gi |
| Redis (optional) | 100m | 128Mi | 200m | 256Mi |

### Scaling Configuration

```yaml
# HPA Configuration
spec:
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

---

## 📊 Monitoring and Logging

### Health Checks
- **Endpoint**: `/api/v1/health/`
- **Response**: `{"status": "healthy", "database": "connected"}`
- **Kubernetes**: Configured in deployment with liveness/readiness probes

### Logging
```bash
# View backend logs
kubectl logs -l app=fatakpay-backend -n production -f

# View specific pod logs  
kubectl logs <pod-name> -n production -f

# View previous container logs
kubectl logs <pod-name> -n production --previous
```

### Metrics
```bash
# Resource usage
kubectl top pods -l app=fatakpay-backend -n production

# HPA status
kubectl get hpa -n production
```

---

## 🔒 Security Considerations

### Network Security
- All traffic encrypted with TLS 1.2+
- CORS configured for specific frontend origins
- Internal cluster communication only
- Database access restricted to backend pods

### Application Security
- JWT tokens with configurable expiration
- Rate limiting on API endpoints
- SQL injection prevention via ORM
- XSS protection with security headers
- CSRF tokens for state-changing operations

### Data Security
- Database connections encrypted
- Secrets managed via Kubernetes secrets
- File uploads validated and scanned
- Audit logging for all operations

---

## 🚨 Troubleshooting

### Common Issues

#### Pod Won't Start
```bash
# Check pod status
kubectl describe pod <pod-name> -n production

# Check events
kubectl get events -n production --sort-by='.lastTimestamp'

# Check logs
kubectl logs <pod-name> -n production
```

#### Database Connection Failed
```bash
# Test database connectivity
kubectl exec -it <pod-name> -n production -- python manage.py dbshell

# Check connection settings
kubectl exec -it <pod-name> -n production -- env | grep DB_
```

#### Health Check Failing
```bash
# Test health endpoint directly
kubectl exec -it <pod-name> -n production -- curl http://localhost:8000/api/v1/health/

# Check application logs
kubectl logs <pod-name> -n production --tail=50
```

#### High Memory Usage
```bash
# Check memory usage
kubectl top pod <pod-name> -n production

# Adjust resource limits
kubectl patch deployment fatakpay-backend -n production -p '{"spec":{"template":{"spec":{"containers":[{"name":"backend","resources":{"limits":{"memory":"2Gi"}}}]}}}}'
```

### Recovery Procedures

#### Database Recovery
```bash
# Restore from backup
kubectl exec -it postgres-pod -n production -- psql -U fatakpay_user fatakpay_tms < backup.sql

# Recreate schemas if needed
kubectl exec -it <backend-pod> -n production -- python manage.py setup_enterprise_db --skip-seed
```

#### Application Recovery
```bash
# Force restart deployment
kubectl rollout restart deployment/fatakpay-backend -n production

# Scale down and up
kubectl scale deployment fatakpay-backend --replicas=0 -n production
kubectl scale deployment fatakpay-backend --replicas=3 -n production
```

---

## 🔄 Updates and Maintenance

### Updating the Application
```bash
# Build new version
docker build -t fatakpay-tms-backend:v1.1.0 .
docker push your-registry.com/fatakpay-tms-backend:v1.1.0

# Update deployment
kubectl set image deployment/fatakpay-backend backend=your-registry.com/fatakpay-tms-backend:v1.1.0 -n production

# Monitor rollout
kubectl rollout status deployment/fatakpay-backend -n production
```

### Database Migrations
```bash
# Run new migrations
kubectl exec -it <pod-name> -n production -- python manage.py migrate

# Check migration status
kubectl exec -it <pod-name> -n production -- python manage.py showmigrations
```

### Backup Strategy
```bash
# Database backup (daily recommended)
kubectl exec postgres-pod -n production -- pg_dump -U fatakpay_user fatakpay_tms > backup_$(date +%Y%m%d).sql

# File backup (if using persistent volumes)
kubectl exec <pod-name> -n production -- tar -czf /tmp/media_backup.tar.gz /app/media/
```

---

## 📞 Support

For deployment issues:
1. Check this troubleshooting guide
2. Review application logs
3. Verify configuration settings
4. Check resource availability
5. Contact system administrator

**Production deployment complete! 🚀**