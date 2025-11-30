# MinIO Web Client Tasks

## Phase 1: Core Foundation (MVP)

- [x] **1.1 Project Setup** <!-- id: 0 -->
    - [x] Initialize Vite project with React + TypeScript <!-- id: 1 -->
    - [x] Configure SSR streaming setup <!-- id: 2 -->
    - [x] Add Tailwind CSS <!-- id: 3 -->
    - [x] Create Docker setup with `mc` binary included <!-- id: 4 -->
    - [x] Setup docker-compose for development <!-- id: 5 -->

- [/] **1.2 Authentication** <!-- id: 6 -->
    - [x] Login page with access key / secret key form <!-- id: 7 -->
    - [x] Server endpoint to validate credentials via `mc alias set` <!-- id: 8 -->
    - [x] Session management (cookie-based) <!-- id: 9 -->
    - [x] Logout (removes mc alias) <!-- id: 10 -->
    - [x] Auth middleware for protected routes <!-- id: 11 -->

- [x] **1.3 Bucket Operations (CRUD)** <!-- id: 12 -->
    - [x] List all buckets <!-- id: 13 -->
    - [x] Create bucket <!-- id: 14 -->
    - [x] Delete bucket (with confirmation) <!-- id: 15 -->
    - [x] View bucket details (size, object count) <!-- id: 16 -->

- [x] **1.4 Basic UI Layout** <!-- id: 17 -->
    - [x] Sidebar navigation (mimics MinIO console) <!-- id: 18 -->
    - [x] Header with user info and logout <!-- id: 19 -->
    - [x] Dashboard overview page <!-- id: 20 -->
    - [x] Bucket list view with cards/table <!-- id: 21 -->
    - [x] Create/Delete modals <!-- id: 22 -->

## Phase 2: Object Browser

- [ ] **2.1 Object Listing** <!-- id: 23 -->
    - [ ] Browse objects within a bucket <!-- id: 24 -->
    - [ ] Breadcrumb navigation for nested paths <!-- id: 25 -->
    - [ ] Display object metadata (size, modified date, type) <!-- id: 26 -->
    - [ ] Pagination / infinite scroll <!-- id: 27 -->

- [ ] **2.2 Object Operations** <!-- id: 28 -->
    - [ ] Upload files (single and multiple) <!-- id: 29 -->
    - [ ] Download files <!-- id: 30 -->
    - [ ] Delete objects <!-- id: 31 -->
    - [ ] Create folders (prefix) <!-- id: 32 -->
    - [ ] Copy/Move objects <!-- id: 33 -->

- [ ] **2.3 Preview & Details** <!-- id: 34 -->
    - [ ] Preview panel for images <!-- id: 35 -->
    - [ ] JSON/text file preview <!-- id: 36 -->
    - [ ] Object metadata display <!-- id: 37 -->
    - [ ] Presigned URL generation <!-- id: 38 -->
