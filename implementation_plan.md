# Implementation Plan - Phase 1: Core Foundation

## Goal Description
Initialize the MinIO Web Client project with the necessary foundation (Tailwind CSS, Docker) and implement the core authentication system using `mc` client.
Ensure compatibility with Coolify and GitHub by adding proper `.gitignore` and `docker-compose.yml`.

## User Review Required
> [!IMPORTANT]
> The `docker-compose.yml` will be updated to include the MinIO service definition provided, ensuring seamless integration.
> `server.js` will be modified to serve as the backend API as well.

## Proposed Changes

### Project Setup
#### [NEW] [.gitignore](file:///C:/Users/khash/Development/minio-web-client/.gitignore)
- Standard gitignore for Node.js, Vite, and OS files.

#### [NEW] [tailwind.config.js](file:///C:/Users/khash/Development/minio-web-client/tailwind.config.js)
- Initialize Tailwind CSS configuration.

#### [NEW] [postcss.config.js](file:///C:/Users/khash/Development/minio-web-client/postcss.config.js)
- PostCSS configuration for Tailwind.

#### [MODIFY] [index.css](file:///C:/Users/khash/Development/minio-web-client/src/index.css)
- Add Tailwind directives.

#### [NEW] [Dockerfile](file:///C:/Users/khash/Development/minio-web-client/Dockerfile)
- Create Dockerfile based on `node:22-alpine`, installing `mc`.

#### [NEW] [docker-compose.yml](file:///C:/Users/khash/Development/minio-web-client/docker-compose.yml)
- Setup services for `minio-web-client` and `minio` (using user provided config).

### Authentication
#### [NEW] [server/routes/auth.ts](file:///C:/Users/khash/Development/minio-web-client/server/routes/auth.ts)
- Implement login/logout routes.

#### [NEW] [server/services/mc.ts](file:///C:/Users/khash/Development/minio-web-client/server/services/mc.ts)
- Implement `McClient` class to wrap `mc` commands.

#### [NEW] [server/services/session.ts](file:///C:/Users/khash/Development/minio-web-client/server/services/session.ts)
- Implement in-memory session management.

#### [NEW] [src/pages/Login.tsx](file:///C:/Users/khash/Development/minio-web-client/src/pages/Login.tsx)
- Create Login page component.

#### [MODIFY] [src/App.tsx](file:///C:/Users/khash/Development/minio-web-client/src/App.tsx)
- Add routing for Login page.

#### [MODIFY] [server.js](file:///C:/Users/khash/Development/minio-web-client/server.js)
- Register auth routes and middleware.

## Verification Plan

### Automated Tests
- Verify `mc` installation in Docker container:
  ```bash
  docker-compose run minio-web-client mc --version
  ```

### Manual Verification
1.  **Tailwind**: Check if styles are applied on the landing page.
2.  **Docker**: Run `docker-compose up` and verify both MinIO and Web Client are running.
3.  **Auth**:
    -   Go to `http://localhost:3000/login`.
    -   Enter MinIO credentials.
    -   Verify successful login redirects to dashboard.
