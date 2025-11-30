# MinIO Web Client - Development Plan

A lightweight, self-hosted web UI replacement for MinIO Community Edition, using `mc` client under the hood.

## Project Overview

### Problem Statement
MinIO removed admin functionality from their Community Edition web UI in May 2025, leaving users with only a basic object browser. The paid AIStor edition starts at $96,000/year—prohibitively expensive for self-hosters and small teams.

### Solution
Build an open-source web UI that:
- Uses the `mc` CLI client under the hood (same as MinIO's own tooling)
- Provides bucket CRUD operations (Phase 1)
- Runs alongside MinIO container with direct access
- Uses the same authentication flow as the original console

### Tech Stack
- **Frontend**: React 18+ with Vite SSR (streaming)
- **Backend**: Node.js (Vite SSR server)
- **CLI Integration**: `mc` client via child_process
- **Styling**: Tailwind CSS
- **Authentication**: MinIO native auth (access key/secret key)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Network                          │
│                                                             │
│  ┌─────────────────┐         ┌─────────────────────────┐   │
│  │                 │         │   minio-web-client      │   │
│  │  MinIO Server   │◄────────│                         │   │
│  │  (port 9000)    │   mc    │  - Vite SSR Server      │   │
│  │                 │  cmds   │  - React Frontend       │   │
│  └─────────────────┘         │  - mc binary            │   │
│                              │  (port 3000)            │   │
│                              └─────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **mc CLI Integration**: Execute `mc` commands via Node.js `child_process.spawn`. This ensures 100% compatibility with MinIO's API without reimplementing S3 logic.

2. **Session-based Alias**: On login, create a temporary `mc alias` with the user's credentials. Store alias name in session.

3. **SSR Streaming**: Use React 18's `renderToPipeableStream` for fast initial page loads.

4. **No External Database**: All state comes from MinIO itself. Session stored in memory or Redis for multi-instance.

---

## Project Structure

```
minio-web-client/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── Dockerfile
├── docker-compose.yml
│
├── src/
│   ├── entry-client.tsx      # Client hydration entry
│   ├── entry-server.tsx      # SSR streaming entry
│   ├── App.tsx
│   ├── index.css
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MainLayout.tsx
│   │   │
│   │   ├── buckets/
│   │   │   ├── BucketList.tsx
│   │   │   ├── BucketCard.tsx
│   │   │   ├── CreateBucketModal.tsx
│   │   │   └── DeleteBucketModal.tsx
│   │   │
│   │   ├── objects/
│   │   │   ├── ObjectBrowser.tsx
│   │   │   ├── ObjectRow.tsx
│   │   │   ├── UploadModal.tsx
│   │   │   └── Breadcrumbs.tsx
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── Input.tsx
│   │       ├── Toast.tsx
│   │       └── Spinner.tsx
│   │
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Buckets.tsx
│   │   └── ObjectBrowser.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useBuckets.ts
│   │   └── useObjects.ts
│   │
│   ├── lib/
│   │   ├── api.ts            # Frontend API client
│   │   └── utils.ts
│   │
│   └── types/
│       └── index.ts
│
├── server/
│   ├── index.ts              # Vite SSR server
│   ├── routes/
│   │   ├── auth.ts           # Login/logout endpoints
│   │   ├── buckets.ts        # Bucket CRUD API
│   │   └── objects.ts        # Object operations API
│   │
│   ├── services/
│   │   ├── mc.ts             # mc CLI wrapper
│   │   └── session.ts        # Session management
│   │
│   └── middleware/
│       └── auth.ts           # Auth middleware
│
└── public/
    └── favicon.svg
```

---

## Phase 1: Core Foundation (MVP)

### 1.1 Project Setup
- [ ] Initialize Vite project with React + TypeScript
- [ ] Configure SSR streaming setup
- [ ] Add Tailwind CSS
- [ ] Create Docker setup with `mc` binary included
- [ ] Setup docker-compose for development

### 1.2 Authentication
- [ ] Login page with access key / secret key form
- [ ] Server endpoint to validate credentials via `mc alias set`
- [ ] Session management (cookie-based)
- [ ] Logout (removes mc alias)
- [ ] Auth middleware for protected routes

**mc commands used:**
```bash
# Validate credentials by setting alias
mc alias set <session-id> http://minio:9000 <access-key> <secret-key>

# Test connection
mc admin info <session-id>

# Remove on logout
mc alias remove <session-id>
```

### 1.3 Bucket Operations (CRUD)
- [ ] List all buckets
- [ ] Create bucket
- [ ] Delete bucket (with confirmation)
- [ ] View bucket details (size, object count)

**mc commands used:**
```bash
# List buckets
mc ls <alias>

# Create bucket
mc mb <alias>/<bucket-name>

# Delete bucket (empty)
mc rb <alias>/<bucket-name>

# Delete bucket (force, with contents)
mc rb --force <alias>/<bucket-name>

# Bucket info/stats
mc stat <alias>/<bucket-name>
```

### 1.4 Basic UI Layout
- [ ] Sidebar navigation (mimics MinIO console)
- [ ] Header with user info and logout
- [ ] Dashboard overview page
- [ ] Bucket list view with cards/table
- [ ] Create/Delete modals

---

## Phase 2: Object Browser

### 2.1 Object Listing
- [ ] Browse objects within a bucket
- [ ] Breadcrumb navigation for nested paths
- [ ] Display object metadata (size, modified date, type)
- [ ] Pagination / infinite scroll

**mc commands used:**
```bash
# List objects
mc ls <alias>/<bucket>/<prefix>

# Recursive listing
mc ls --recursive <alias>/<bucket>

# Object details
mc stat <alias>/<bucket>/<object>
```

### 2.2 Object Operations
- [ ] Upload files (single and multiple)
- [ ] Download files
- [ ] Delete objects
- [ ] Create folders (prefix)
- [ ] Copy/Move objects

**mc commands used:**
```bash
# Upload
mc cp <local-file> <alias>/<bucket>/<path>

# Download
mc cp <alias>/<bucket>/<object> <local-path>

# Delete
mc rm <alias>/<bucket>/<object>

# Delete recursive
mc rm --recursive --force <alias>/<bucket>/<prefix>

# Copy
mc cp <alias>/<bucket>/<src> <alias>/<bucket>/<dest>

# Move
mc mv <alias>/<bucket>/<src> <alias>/<bucket>/<dest>
```

### 2.3 Preview & Details
- [ ] Preview panel for images
- [ ] JSON/text file preview
- [ ] Object metadata display
- [ ] Presigned URL generation

---

## Phase 3: Advanced Features (Future)

### 3.1 Access Management
- [ ] List users
- [ ] Create/delete users
- [ ] Policy management
- [ ] Access key management

### 3.2 Bucket Configuration
- [ ] Bucket policies
- [ ] Lifecycle rules
- [ ] Versioning settings
- [ ] Replication configuration

### 3.3 Monitoring
- [ ] Server info dashboard
- [ ] Storage usage metrics
- [ ] Request statistics

---

## Technical Implementation Details

### mc CLI Wrapper Service

```typescript
// server/services/mc.ts
import { spawn } from 'child_process';

interface McResult {
  success: boolean;
  data?: any;
  error?: string;
}

export class McClient {
  private alias: string;

  constructor(alias: string) {
    this.alias = alias;
  }

  static async createAlias(
    alias: string,
    endpoint: string,
    accessKey: string,
    secretKey: string
  ): Promise<McResult> {
    return this.execute([
      'alias', 'set', alias, endpoint, accessKey, secretKey
    ]);
  }

  static async removeAlias(alias: string): Promise<McResult> {
    return this.execute(['alias', 'remove', alias]);
  }

  async listBuckets(): Promise<McResult> {
    return McClient.execute(['ls', '--json', this.alias]);
  }

  async createBucket(name: string): Promise<McResult> {
    return McClient.execute(['mb', `${this.alias}/${name}`]);
  }

  async deleteBucket(name: string, force = false): Promise<McResult> {
    const args = force 
      ? ['rb', '--force', `${this.alias}/${name}`]
      : ['rb', `${this.alias}/${name}`];
    return McClient.execute(args);
  }

  async listObjects(bucket: string, prefix = ''): Promise<McResult> {
    const path = prefix 
      ? `${this.alias}/${bucket}/${prefix}`
      : `${this.alias}/${bucket}`;
    return McClient.execute(['ls', '--json', path]);
  }

  private static execute(args: string[]): Promise<McResult> {
    return new Promise((resolve) => {
      const proc = spawn('mc', args);
      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('close', (code) => {
        if (code === 0) {
          // mc --json outputs one JSON object per line
          const lines = stdout.trim().split('\n').filter(Boolean);
          const data = lines.map(line => {
            try {
              return JSON.parse(line);
            } catch {
              return line;
            }
          });
          resolve({ success: true, data });
        } else {
          resolve({ success: false, error: stderr || 'Command failed' });
        }
      });
    });
  }
}
```

### Session Management

```typescript
// server/services/session.ts
import { randomUUID } from 'crypto';

interface Session {
  id: string;
  alias: string;
  accessKey: string;
  endpoint: string;
  createdAt: Date;
}

// In-memory store (use Redis for production multi-instance)
const sessions = new Map<string, Session>();

export function createSession(accessKey: string, endpoint: string): Session {
  const id = randomUUID();
  const alias = `session_${id.replace(/-/g, '').slice(0, 12)}`;
  
  const session: Session = {
    id,
    alias,
    accessKey,
    endpoint,
    createdAt: new Date(),
  };
  
  sessions.set(id, session);
  return session;
}

export function getSession(id: string): Session | undefined {
  return sessions.get(id);
}

export function deleteSession(id: string): boolean {
  return sessions.delete(id);
}
```

### API Routes Example

```typescript
// server/routes/buckets.ts
import { Router } from 'express';
import { McClient } from '../services/mc';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

// GET /api/buckets
router.get('/', async (req, res) => {
  const mc = new McClient(req.session.alias);
  const result = await mc.listBuckets();
  
  if (result.success) {
    res.json({ buckets: result.data });
  } else {
    res.status(500).json({ error: result.error });
  }
});

// POST /api/buckets
router.post('/', async (req, res) => {
  const { name } = req.body;
  
  if (!name || !/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(name)) {
    return res.status(400).json({ error: 'Invalid bucket name' });
  }
  
  const mc = new McClient(req.session.alias);
  const result = await mc.createBucket(name);
  
  if (result.success) {
    res.json({ message: 'Bucket created', name });
  } else {
    res.status(500).json({ error: result.error });
  }
});

// DELETE /api/buckets/:name
router.delete('/:name', async (req, res) => {
  const { name } = req.params;
  const { force } = req.query;
  
  const mc = new McClient(req.session.alias);
  const result = await mc.deleteBucket(name, force === 'true');
  
  if (result.success) {
    res.json({ message: 'Bucket deleted', name });
  } else {
    res.status(500).json({ error: result.error });
  }
});

export default router;
```

---

## Docker Setup

### Dockerfile

```dockerfile
FROM node:20-alpine

# Install mc client
RUN wget https://dl.min.io/client/mc/release/linux-amd64/mc \
    && chmod +x mc \
    && mv mc /usr/local/bin/

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
```

### docker-compose.yml (Development)

```yaml
version: '3.8'

services:
  minio-web-client:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MINIO_ENDPOINT=http://minio:9000
      - NODE_ENV=development
    volumes:
      - ./src:/app/src
      - ./server:/app/server
    depends_on:
      - minio

  minio:
    image: quay.io/minio/minio:RELEASE.2025-04-22T22-12-26Z
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=minioadmin
    volumes:
      - minio-data:/data

volumes:
  minio-data:
```

### docker-compose.prod.yml (For Coolify Integration)

```yaml
version: '3.8'

services:
  minio-web-client:
    image: your-registry/minio-web-client:latest
    ports:
      - "3000:3000"
    environment:
      - MINIO_ENDPOINT=${MINIO_ENDPOINT:-http://minio:9000}
      - NODE_ENV=production
      - SESSION_SECRET=${SESSION_SECRET}
    networks:
      - minio-network

networks:
  minio-network:
    external: true
```

---

## UI Design Direction

Following the original MinIO Console aesthetic with a **clean, utilitarian, developer-focused** design:

### Color Palette
```css
:root {
  /* MinIO-inspired colors */
  --color-primary: #C72C48;      /* MinIO Red */
  --color-primary-dark: #A12039;
  --color-bg-dark: #0F172A;      /* Dark navy background */
  --color-bg-card: #1E293B;      /* Card background */
  --color-bg-sidebar: #1E293B;
  --color-text: #F8FAFC;
  --color-text-muted: #94A3B8;
  --color-border: #334155;
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
}
```

### Typography
- **Headings**: "IBM Plex Sans" or "Source Sans Pro"
- **Body/UI**: "Inter" (acceptable here as it matches MinIO's dev aesthetic)
- **Monospace**: "IBM Plex Mono" for technical values

### Layout
- Fixed sidebar (240px) with navigation
- Top header with breadcrumbs and user menu
- Main content area with cards/tables
- Dark theme by default (matches MinIO console)

---

## Development Timeline

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| 1.1 | Project setup, Vite SSR, Docker | 1-2 days |
| 1.2 | Authentication system | 1-2 days |
| 1.3 | Bucket CRUD operations | 2-3 days |
| 1.4 | Basic UI layout | 2-3 days |
| **Phase 1 Total** | **MVP Release** | **~1-2 weeks** |
| 2.1 | Object listing & navigation | 2-3 days |
| 2.2 | Object operations (upload/download/delete) | 3-4 days |
| 2.3 | Preview & details panel | 2-3 days |
| **Phase 2 Total** | **Object Browser** | **~1-2 weeks** |

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/minio-web-client.git
cd minio-web-client

# Install dependencies
npm install

# Start development (with local MinIO)
docker-compose up -d minio
npm run dev

# Build for production
npm run build
docker build -t minio-web-client .
```

---

## Contributing

This project aims to fill the gap left by MinIO's decision to remove admin features from their community edition. Contributions are welcome!

### Areas for Contribution
- Additional mc command integrations
- UI/UX improvements
- Multi-language support
- Testing coverage
- Documentation

---

## License

MIT License - Free to use, modify, and distribute.

---

## References

- [MinIO Client (mc) Documentation](https://min.io/docs/minio/linux/reference/minio-mc.html)
- [Original MinIO Console (archived)](https://github.com/minio/console)
- [OpenMaxIO Fork](https://github.com/OpenMaxIO/openmaxio-object-browser)
- [Vite SSR Guide](https://vitejs.dev/guide/ssr.html)
