import { Application, Request, Response, NextFunction } from 'express';
import Database from 'better-sqlite3';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';

declare global {
    namespace Express {
        interface User { id: number; username: string; roles: string[]; }
    }
}

export function initAuth(app: Application, db: Database.Database) {
    const SQLiteStore = connectSqlite3(session);
    
    app.use(session({
        store: new SQLiteStore({ db: 'sessions.sqlite3', dir: '.' }) as unknown as session.Store,
        secret: 'SecretKey',
        resave: false,
        saveUninitialized: false,
        cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const row = db.prepare('SELECT id, username, password_hash, roles FROM users WHERE username = ?')
                .get(username) as { id: number; username: string; password_hash: string; roles: string } | undefined;
            
            if (!row) return done(null, false, { message: 'Nieprawidłowe dane logowania' });
            
            const ok = await bcrypt.compare(password, row.password_hash);
            if (!ok) return done(null, false, { message: 'Nieprawidłowe dane logowania' });
            
            return done(null, { id: row.id, username: row.username, roles: JSON.parse(row.roles) });
        } catch (e) {
            return done(e);
        }
    }));

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id: number, done) => {
        try {
            const row = db.prepare('SELECT id, username, roles FROM users WHERE id = ?')
                .get(id) as { id: number; username: string; roles: string } | undefined;
            
            if (!row) return done(null, false);
            done(null, { id: row.id, username: row.username, roles: JSON.parse(row.roles) });
        } catch (e) {
            done(e);
        }
    });

}
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ error: 'Musisz się zalogować.' });
};

export const requireRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Sprawdzanie, czy w ogóle jest zalogowany
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: 'Musisz się zalogować.' });
        }
        // Sprawdzanie, czy ma wymaganą rolę (np. 'ADMIN' lub 'RECRUITER')
        if (!req.user?.roles.includes(role)) {
            return res.status(403).json({ error: 'Odmowa dostępu. Brak uprawnień do tego zasobu.' });
        }
        next();
    };
};