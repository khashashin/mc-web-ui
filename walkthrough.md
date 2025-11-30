# MinIO Web Client - Walkthrough

## Prerequisites
- Docker and Docker Compose installed
- Node.js 22+ installed (for local dev)

## Running the Application

### 1. Start MinIO and Web Client (Docker)
This will start both the MinIO server and the Web Client.

```bash
docker-compose up -d
```

- **MinIO Web Client**: [http://localhost:3000](http://localhost:3000)
- **MinIO Console**: [http://localhost:9001](http://localhost:9001)
- **MinIO API**: [http://localhost:9000](http://localhost:9000)

### 2. Login
Use the default MinIO credentials:
- **Endpoint**: `http://minio:9000` (internal Docker network address)
- **Access Key**: `minioadmin`
- **Secret Key**: `minioadmin`

> [!NOTE]
> When running in Docker, the Web Client talks to MinIO via the internal Docker network. Use `http://minio:9000` as the endpoint.

## Verification Steps

### 1. Authentication
- [ ] Navigate to [http://localhost:3000](http://localhost:3000)
- [ ] Enter credentials (`http://minio:9000`, `minioadmin`, `minioadmin`)
- [ ] Click "Sign In"
- [ ] Verify you are redirected to the Dashboard

### 2. Bucket Operations
- [ ] **List Buckets**: Verify you see a list of buckets (empty initially).
- [ ] **Create Bucket**:
    - Click "Create Bucket"
    - Enter a name (e.g., `test-bucket`)
    - Click "Create"
    - Verify the new bucket appears in the list
- [ ] **Delete Bucket**:
    - Click the trash icon on the bucket card
    - Confirm deletion
    - Verify the bucket is removed

### 3. UI Layout
- [ ] Verify Sidebar contains "Buckets" link
- [ ] Verify Header shows user info
- [ ] Verify Logout button works and redirects to Login page

## Troubleshooting

### "Connection Refused"
If the Web Client cannot connect to MinIO, ensure you are using the correct internal endpoint (`http://minio:9000`) when logging in.

### "Mc Command Failed"
Check the logs of the web client container:
```bash
docker-compose logs -f minio-web-client
```
