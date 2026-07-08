# FatakPay TMS — Kubernetes Deployment Guide

## 🚀 Complete Production Deployment Guide

### Prerequisites
- Kubernetes cluster running
- PostgreSQL instance (managed or self-hosted)
- Docker registry access
- kubectl configured

---

## 📋 Step 1: Environment Variables

Create a Kubernetes secret with your PostgreSQL credentials:

```bash
kubectl create secret generic fatakpay-tms-secrets \
  --from-literal=DB_NAME=fatakpay_tms \
  --from-literal=DB_USER=your_postgres_user \
  --from-literal=DB_PASSWORD=your_postgres_password \
  --from-literal=DB_HOST=your_postgres_host \
  --from-literal=DB_PORT=5432 \
  --from-literal=SECRET_KEY=your-super-secret-django-key-here \
  --from-literal=ALLOWED_HOSTS=your-domain.com,api.your-domain.com \
  --from-literal=CORS_ALLOWED_ORIGINS=https://your-frontend.com
```

---

## 📋 Step 2: Kubernetes Deployment YAML

Create `k8s-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fatakpay-tms-backend
  labels:
    app: fatakpay-tms-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fatakpay-tms-backend
  template:
    metadata:
      labels:
        app: fatakpay-tms-backend
    spec:
      containers:
      - name: backend
        image: your-registry/fatakpay-tms-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: DB_NAME
          valueFrom:
            secretKeyRef:
              name: fatakpay-tms-secrets
              key: DB_NAME
        - name: DB_USER
          valueFrom:
            secretKeyRef:
              name: fatakpay-tms-secrets
              key: DB_USER
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: fatakpay-tms-secrets
              key: DB_PASSWORD
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: fatakpay-tms-secrets
              key: DB_HOST
        - name: DB_PORT
          valueFrom:
            secretKeyRef:
              name: fatakpay-tms-secrets
              key: DB_PORT
        - name: SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: fatakpay-tms-secrets
              key: SECRET_KEY
        - name: ALLOWED_HOSTS
          valueFrom:
            secretKeyRef:
              name: fatakpay-tms-secrets
              key: ALLOWED_HOSTS
        - name: CORS_ALLOWED_ORIGINS
          valueFrom:
            secretKeyRef:
              name: fatakpay-tms-secrets
              key: CORS_ALLOWED_ORIGINS
        - name: DEBUG
          value: "False"
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/v1/health/
            port: 8000
          initialDelaySeconds: 60
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /api/v1/health/
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10

---
apiVersion: v1
kind: Service
metadata:
  name: fatakpay-tms-backend-service
spec:
  selector:
    app: fatakpay-tms-backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8000
  type: LoadBalancer

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: fatakpay-tms-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: api.your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: fatakpay-tms-backend-service
            port:
              number: 80
```

---

## 📋 Step 3: Deploy to Kubernetes

```bash
# Apply the deployment
kubectl apply -f k8s-deployment.yaml

# Check deployment status
kubectl get deployments
kubectl get pods
kubectl get services

# View logs
kubectl logs -l app=fatakpay-tms-backend --tail=50
```

---

## 📋 Step 4: Database Setup (One-time)

After deployment, initialize the database:

```bash
# Get pod name
POD_NAME=$(kubectl get pods -l app=fatakpay-tms-backend -o jsonpath='{.items[0].metadata.name}')

# Set up database with schemas and sample data
kubectl exec -it $POD_NAME -- python manage.py setup_enterprise_db

# OR setup schemas only (no sample data)
kubectl exec -it $POD_NAME -- python manage.py setup_enterprise_db --skip-seed
```

---

## 📋 Step 5: Verify Deployment

```bash
# Check if schemas were created properly
kubectl exec -it $POD_NAME -- python manage.py shell -c "
from django.db import connection
cursor = connection.cursor()
cursor.execute('SELECT schemaname, COUNT(*) FROM pg_tables WHERE schemaname IN (\\'identity\\', \\'core\\', \\'ai\\', \\'audit\\') GROUP BY schemaname')
for row in cursor.fetchall():
    print(f'{row[0]}: {row[1]} tables')
"

# Test API health
kubectl exec -it $POD_NAME -- curl -f http://localhost:8000/api/v1/health/

# Check external access (replace with your domain)
curl -f https://api.your-domain.com/api/v1/health/
```

---

## 🗄️ Database Schema Architecture

Your PostgreSQL database will have this enterprise structure:

```
fatakpay_tms (database)
│
├── identity     — users, authentication, JWT tokens
├── core         — tickets, departments, comments, attachments  
├── ai           — analysis cache, training feedback, request logs
├── audit        — audit logs, notifications, email logs
└── system       — Django internal (migrations, admin, celery)
```

**Benefits:**
- **Schema-level security**: Different services access different schemas
- **Cleaner backups**: Dump schemas independently
- **Better monitoring**: Track usage per schema  
- **Multi-tenant ready**: Easy to add client-specific schemas later

---

## 🔐 Default Login Credentials

After running `setup_enterprise_db`, use these to test:

**Super Admin:**
- Email: `admin@fatakpay.com`
- Password: `Admin@1234`

**Department Heads:**
- Email: `arjun.sharma@fatakpay.com` (IT Head)
- Password: `Head@1234`

**Team Members:**
- Email: `nikhil.pandey@fatakpay.com` (IT Member)
- Password: `Member@1234`

---

## 🔧 Troubleshooting

### Pod Not Starting
```bash
# Check events
kubectl describe pod $POD_NAME

# Check logs for errors
kubectl logs $POD_NAME --previous
```

### Database Connection Issues
```bash
# Test database connection from pod
kubectl exec -it $POD_NAME -- python manage.py shell -c "
from django.db import connection
connection.cursor().execute('SELECT 1')
print('✓ Database connected')
"
```

### Schema Not Created
```bash
# Manually create schemas if needed
kubectl exec -it $POD_NAME -- python manage.py shell -c "
from django.db import connection
cursor = connection.cursor()
for schema in ['identity', 'core', 'ai', 'audit', 'system']:
    cursor.execute(f'CREATE SCHEMA IF NOT EXISTS {schema}')
print('✓ Schemas created')
"
```

---

## 🚀 Production Considerations

1. **Security**
   - Use strong `SECRET_KEY` (50+ random characters)
   - Set `DEBUG=False` in production
   - Configure proper `ALLOWED_HOSTS`
   - Use HTTPS only (`SECURE_SSL_REDIRECT=True`)

2. **Database**
   - Use managed PostgreSQL service (AWS RDS, Google Cloud SQL)
   - Enable connection pooling
   - Set up read replicas for scalability
   - Configure automated backups

3. **Monitoring**
   - Set up application monitoring (DataDog, New Relic)
   - Configure log aggregation (ELK stack, Fluentd)
   - Set up alerts for pod failures

4. **Scaling**
   - Configure Horizontal Pod Autoscaler (HPA)
   - Use persistent volumes for file uploads
   - Consider Redis for session storage

---

## ✅ Deployment Checklist

- [ ] PostgreSQL instance running and accessible
- [ ] Kubernetes secrets created with correct credentials
- [ ] Docker image built and pushed to registry
- [ ] Deployment YAML configured with your domain
- [ ] kubectl configured and connected to cluster
- [ ] Deployment applied successfully
- [ ] Pods running and healthy
- [ ] Database schemas created
- [ ] Health check endpoint responding
- [ ] External domain resolving correctly

**🎉 Your FatakPay TMS is now live on Kubernetes!**