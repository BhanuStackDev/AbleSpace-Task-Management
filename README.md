# AbleSpace - Task Management System

A responsive full-stack task management application built for the AbleSpace Full Stack Developer technical assessment.

## Live Demo

- Frontend: https://able-space-task-management.vercel.app/login
- Backend API: https://ablespace-backend-7gu3.onrender.com
- GitHub: https://github.com/BhanuStackDev/AbleSpace-Task-Management

## Tech Stack

- Frontend: Next.js 16, App Router, React, TypeScript, Tailwind CSS
- Backend: NestJS, TypeScript
- Database: SQLite with TypeORM
- Validation: class-validator and class-transformer
- Deployment: Vercel (frontend) and Render (backend)

## Part 1 - Task Management System

### Implemented features

- Guest login and protected application flow
- Figma-inspired task workspace layout
- Tasks grouped into To Do, Doing and Completed sections
- Create, view, edit and delete tasks
- Task status and priority management
- Due dates and calendar view
- Search across task titles and descriptions
- Light and dark theme support with refresh persistence
- Responsive desktop, tablet and mobile layouts
- Reusable task, layout and modal components
- NestJS REST API with validation
- SQLite persistence through TypeORM
- Local storage fallback when the API is temporarily unavailable

### Backend health

The Render backend root URL returns a small health response, while task APIs are under `/api`.

- Health: `https://ablespace-backend-7gu3.onrender.com/api/health`
- Tasks: `https://ablespace-backend-7gu3.onrender.com/api/tasks`

### API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |



## Run locally

### Backend


cd backend
npm install
npm run start:dev


API:
`http://localhost:4000/api`

### Frontend

Open a second terminal:


cd frontend
npm install
npm run dev


App:
`http://localhost:3000`

Optional frontend environment variable:


NEXT_PUBLIC_API_URL=http://localhost:4000/api


For the deployed frontend, set `NEXT_PUBLIC_API_URL` to:


https://ablespace-backend-7gu3.onrender.com

## Architecture

The frontend uses the Next.js App Router and reusable components for the sidebar, header, task board and task modals.

The backend exposes a small REST API through NestJS. DTO validation is enabled globally with `ValidationPipe`, while TypeORM manages SQLite persistence.

The frontend first attempts to use persisted task data and falls back to local storage when the API is unavailable. This keeps the assessment demo usable during temporary backend cold starts.

## Design fidelity and intentional deviations

The task workspace follows the supplied Figma direction: a light workspace shell, left navigation, grouped task sections, table-style task rows, priority/member/due-date columns and row actions.

Intentional implementation choices:

- Guest authentication is used because the assessment requires a Guest Login flow and no production authentication service was required.
- Member avatars use a guest/demo representation rather than real user accounts.
- The mobile layout uses horizontal table scrolling where necessary to preserve the information hierarchy of the desktop design.
- The Fields control is presented as a UI affordance for the assessment design; the core task workflow remains fully functional without custom field configuration.

## Part 2 - Product Understanding

A separate walkthrough document is included for the AbleSpace Caseload -> Take Data workflow. It explains the visible workflow from the supplied assessment reference and documents UX/UI and functionality improvements.

Recommended submission file:

`docs/AbleSpace-Part2-Take-Data-Walkthrough.pdf`

## Deployment

The frontend is deployed on Vercel and the backend is deployed on Render.

Both services should remain publicly accessible for the required post-submission period.

## Author

Bhanuday Urmaliya

Full Stack Developer
