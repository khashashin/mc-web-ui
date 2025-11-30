# MC Web UI

A modern, lightweight, and beautiful web interface for MinIO Object Storage, built with React, Vite, shadcn/ui, and Node.js.

![MC Web UI](https://github.com/khashashin/mc-web-ui/raw/main/public/screenshot.png)

## Features

-   **Modern UI**: Built with [shadcn/ui](https://ui.shadcn.com/) and Tailwind CSS for a clean, dark-mode first aesthetic.
-   **Bucket Management**: Create, list, and delete buckets with validation.
-   **Object Browser**: View objects within buckets (list view).
-   **Hybrid Backend**:
    -   Uses **MinIO Node.js SDK** for development (fast, direct connection).
    -   Uses **MinIO Client (`mc`) CLI** for production (robust, feature-rich).
-   **Docker Ready**: Fully containerized for easy deployment.

## Tech Stack

-   **Frontend**: React, TypeScript, Vite, React Router, React Hook Form, Zod.
-   **Backend**: Node.js, Express, MinIO SDK.
-   **Styling**: Tailwind CSS, shadcn/ui, Lucide Icons.

## Deployment

### Docker Compose

1.  Clone the repository.
2.  Run with Docker Compose:

```bash
docker compose up -d
```

The app will be available at `http://localhost:3000`.

### Coolify

You can deploy this directly to [Coolify](https://coolify.io/) using the provided `coolify.yaml` or by adding a Docker Compose service:

```yaml
services:
  mc-web-ui:
    image: ghcr.io/khashashin/mc-web-ui:latest
    environment:
      - MINIO_ENDPOINT=http://minio:9000 # Internal URL to your MinIO service
      - NODE_ENV=production
    ports:
      - "3000:3000"
```

## Development

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```

## License

The source code of this project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

### ⚠️ Important Note regarding Docker Image

The Docker image distributed for this project includes the **MinIO Client (`mc`)** binary, which is licensed under the **GNU Affero General Public License v3.0 (AGPLv3)**.

-   If you use the source code of this project alone, it is governed by the MIT License.
-   If you distribute, modify, or provide network access to the **Docker image** (which contains `mc`), you must comply with the terms of the AGPLv3 regarding the `mc` binary.

This project is not affiliated with or endorsed by MinIO, Inc.
