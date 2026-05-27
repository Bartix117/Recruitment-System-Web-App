import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';

export function authEndpoints() {
    const router = Router();


    /**
* @openapi
* /api/auth/login:
*   post:
*     summary: Logowanie użytkownika do systemu
*     tags: [Auth]
*     description: Uwierzytelnia użytkownika przy użyciu lokalnej strategii (Passport.js) i tworzy nową sesję opartą na ciasteczkach.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - username
*               - password
*             properties:
*               username:
*                 type: string
*                 description: Nazwa użytkownika (lub email, w zależności od konfiguracji Passport)
*                 example: admin
*               password:
*                 type: string
*                 description: Hasło użytkownika
*                 example: admin123
*     responses:
*       200:
*         description: Zalogowano pomyślnie
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Zalogowano pomyślnie
*                 user:
*                   type: object
*                   description: Obiekt zawierający dane zalogowanego użytkownika
*       401:
*         description: Błąd autoryzacji (np. nieprawidłowe hasło lub brakujący użytkownik)
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: Błąd logowania
*       500:
*         description: Wewnętrzny błąd serwera podczas logowania
     */
    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (err: any, user: any, info: any) => {
            if (err) return next(err);
            if (!user) return res.status(401).json({ error: info.message || 'Błąd logowania' });
            
            req.logIn(user, (err) => {
                if (err) return next(err);
                return res.json({ message: 'Zalogowano pomyślnie', user });
            });
        })(req, res, next);
    });

    /**
* @openapi
* /api/auth/logout:
*   post:
*     summary: Wylogowanie użytkownika
*     tags: [Auth]
*     description: Niszczy aktualną sesję użytkownika na serwerze i czyści ciasteczko sesyjne.
*     responses:
*       200:
*         description: Pomyślnie wylogowano
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Wylogowano pomyślnie
*       500:
*         description: Wewnętrzny błąd serwera podczas wylogowywania
     */
    router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
        req.logout((err) => {
            if (err) return next(err);
            res.json({ message: 'Wylogowano pomyślnie' });
        });
    });

    /**
* @openapi
* /api/auth/me:
*   get:
*     summary: Weryfikacja aktywnej sesji (Pobieranie danych o sobie)
*     tags: [Auth]
*     description: Sprawdza, czy użytkownik posiada aktywne ciasteczko sesyjne. Jeśli tak, zwraca jego zdekodowane dane z bazy. Używane przez frontend do utrzymywania stanu logowania po odświeżeniu strony.
*     responses:
*       200:
*         description: Sesja jest aktywna
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 user:
*                   type: object
*                   description: Pełne dane autoryzowanego użytkownika pochodzące z sesji
*       401:
*         description: Brak aktywnej sesji (użytkownik niezalogowany)
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: Brak sesji
     */
    router.get('/me', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.json({ user: req.user });
        } else {
            res.status(401).json({ error: 'Brak sesji' });
        }
    });

    return router;
}