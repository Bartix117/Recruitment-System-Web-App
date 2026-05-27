import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import http from 'http';
import { applicationsRouter } from './api/applications';
import { jobsRouter } from './api/jobs';
import { companiesRouter } from './api/companies';
import { globalErrorHandler } from './middleware/errorHandler';
import { adminRouter } from './api/admin';
import { initAuth, requireRole } from './auth';
import { authEndpoints } from './api/authRouter';
import { initWebSocket } from './websockets';

const app = express();
const PORT = 3000;

const server = http.createServer(app);

app.use(cors({
    origin: 'http://localhost:4200', 
    credentials: true 
}));
app.use(express.json());


const dbPath = path.resolve(__dirname, '../data/app.sqlite3');
const connection = new Database(dbPath);

app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

initAuth(app, connection);
app.use('/api/auth', authEndpoints());

initWebSocket(app, server, '/ws');

//dostepne dla kandydata
app.use('/api/jobs', jobsRouter(connection));
app.use('/api/companies', companiesRouter(connection));

// tylko dla admina
app.use('/api/admin', requireRole('ADMIN'), adminRouter(connection));

app.use('/api/applications',  applicationsRouter(connection));

app.use(globalErrorHandler);
server.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});