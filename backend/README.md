
## Backend setup

```powershell
cd backend
npm install
npm run start:dev
```

The backend runs on `http://localhost:4000` and exposes the task API under `/api/tasks`.
The SQLite database is stored as `ablespace.sqlite` in the backend directory.

### TypeScript config note

The backend `tsconfig.json` intentionally does **not** use `ignoreDeprecations`. This avoids the
`TS5103: Invalid value for '--ignoreDeprecations'` error encountered with incompatible TypeScript versions.
