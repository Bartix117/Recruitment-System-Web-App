import expressWs from 'express-ws';
import { Application } from 'express';
import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';

interface AuthWs extends WebSocket {
    userId?: number;
    username?: string;
    userRoles?: string[]; // <-- Zmiana na string[]
    isAlive?: boolean;
}

let wsServer: WebSocketServer | null = null;

export function initWebSocket(app: Application, httpServer: Server, wsPath: string): void {
    const instance = expressWs(app, httpServer);
    wsServer = instance.getWss();

    instance.app.ws(wsPath, (ws: AuthWs, req: any) => {
        
        // Autoryzacja - sprawdzanie, czy użytkownik jest zalogowany
        if (!req.user) {
            ws.close(1008, 'Unauthorized');
            return;
        }

        ws.isAlive   = true;
        ws.userId    = req.user.id;
        ws.username  = req.user.username;
        let userRole = req.user.role || req.user.roles || req.user.role_name;

        ws.userRoles = userRole ? (Array.isArray(userRole) ? userRole : [userRole]) : [];

        ws.on('pong', () => { ws.isAlive = true; });

        ws.on('close', () => console.log(`WS: rozłączono (user ${ws.username})`));

        ws.send(JSON.stringify({ type: 'WELCOME', message: 'Połączono z serwerem' }));
        console.log(`WS: połączono (user ${ws.username}, rola: ${ws.userRoles})`);
    });

    setInterval(() => {
        wsServer!.clients.forEach(client => {
            const ws = client as AuthWs;
            if (!ws.isAlive) { ws.terminate(); return; }
            ws.isAlive = false;
            ws.ping();
        });
    }, 10_000);
}

export function broadcast(roles: string[], message: object): void {
    if (!wsServer) return;
    const json = JSON.stringify(message);
    
    wsServer.clients.forEach(client => {
        const c = client as AuthWs;
        if (c.readyState === WebSocket.OPEN && c.userRoles?.some(r => roles.includes(r))) {
            c.send(json);
        }
    });
}