import { Router, Request, Response, NextFunction } from 'express';
import Database from 'better-sqlite3';
import createError from 'http-errors';
import { ApplicationModel } from '../models/applications';
import { uploadCV } from '../middleware/upload';
import { requireRole } from '../auth';
import { broadcast } from '../websockets';

export function applicationsRouter(connection: Database.Database): Router {
    const router = Router();

    /**
 * @openapi
 * /api/applications/stats:
 *   get:
 *     summary: Pobiera statystyki zgłoszeń (wykorzystywane do generowania wykresu)
 *     tags: [Applications]
 *     description: Zwraca liczbę wszystkich aplikacji pogrupowaną po nazwach firm. Wymaga roli RECRUITER.
 *     responses:
 *       200:
 *         description: Zestawienie statystyk.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   company:
 *                     type: string
 *                     example: "TechCorp"
 *                   count:
 *                     type: integer
 *                     example: 14
 *       401:
 *         description: Brak dostępu (niezalogowany).
 *       403:
 *         description: Brak uprawnień (wymagana rola RECRUITER).
     */
    //STATYSTYKI DO WYKRESU
        router.get('/stats', requireRole('RECRUITER'), (req, res) => {
            const data = connection.prepare(`
                SELECT c.name as company, COUNT(a.id) as count
                FROM companies c
                JOIN jobs j ON c.id = j.company_id
                JOIN applications a ON j.id = a.job_id
                GROUP BY c.name
            `).all();
            res.json(data);
        });

        /**
* @openapi
* /api/applications:
*   get:
*     summary: Pobiera listę wszystkich zgłoszeń z systemu
*     tags: [Applications]
*     description: Zwraca listę wszystkich aplikacji powiązanych z odpowiednią ofertą i firmą. Wymaga roli RECRUITER.
*     responses:
*       200:
*         description: Tablica ze zgłoszeniami
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   id:
*                     type: integer
*                   job_id:
*                     type: integer
*                   user_id:
*                     type: integer
*                   first_name:
*                     type: string
*                   last_name:
*                     type: string
*                   email:
*                     type: string
*                   phone:
*                     type: string
*                   cv_link:
*                     type: string
*                   message:
*                     type: string
*                   status:
*                     type: string
*                   created_at:
*                     type: string
*                     format: date-time
*                   job_title:
*                     type: string
*                   company_name:
*                     type: string
*       401:
*         description: Brak dostępu.
*       403:
*         description: Brak uprawnień (wymagana rola RECRUITER).
*       500:
*         description: Błąd wewnętrzny serwera.
     */
    // POBIERANIE ZGLOSZEN
    router.get('/', requireRole('RECRUITER'),(req: Request, res: Response, next: NextFunction) => {
        try {
            const statement = connection.prepare(`
                SELECT 
                    applications.*, 
                    jobs.title as job_title,
                    companies.name as company_name
                FROM applications 
                JOIN jobs ON applications.job_id = jobs.id
                JOIN companies ON jobs.company_id = companies.id
                ORDER BY applications.created_at DESC
            `);
            const applications = statement.all();
            res.json(applications);
        } catch (error) {
            next(createError(500, 'Nie udało się pobrać zgłoszeń'));
        }
    });

    /**
* @openapi
* /api/applications/{id}/status:
*   put:
*     summary: Zmienia status aplikacji (np. ZAAKCEPTOWANE / ODRZUCONE)
*     tags: [Applications]
*     description: Aktualizuje status zgłoszenia. W przypadku sukcesu emituje zdarzenie 'STATUS_CHANGED' poprzez WebSockets do klientów (Rekruter i Kandydat).
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*         description: ID aplikacji
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               status:
*                 type: string
*                 enum: ['OCZEKUJĄCE', 'ZAAKCEPTOWANE', 'ODRZUCONE']
*     responses:
*       200:
*         description: Sukces. Zwraca potwierdzenie zmiany.
*       400:
*         description: Nieprawidłowy status.
*       404:
*         description: Nie znaleziono aplikacji o podanym ID.
     */
    //ZMIANA STATUSU
    router.put('/:id/status', (req, res, next) => {
        try {
            const applicationId = req.params.id;
            const newStatus = req.body.status;

            if (!['OCZEKUJĄCE', 'ZAAKCEPTOWANE', 'ODRZUCONE'].includes(newStatus)) {
                return res.status(400).json({ error: "Nieprawidłowy status." });
            }

            const stmt = connection.prepare('UPDATE applications SET status = ? WHERE id = ?');
            const info = stmt.run(newStatus, applicationId);

            if (info.changes === 0) {
                return res.status(404).json({ error: "Nie znaleziono zgłoszenia o tym ID." });
            }

            broadcast(['RECRUITER'], { 
                type: 'STATUS_CHANGED', 
                id: applicationId, 
                status: newStatus 
            });
            broadcast(['RECRUITER', 'CANDIDATE'], { 
            type: 'STATUS_CHANGED', 
            id: applicationId, 
            status: newStatus 
            });

            res.json({ success: true, message: `Status zmieniony na ${newStatus}` });
        } catch (error) {
            next(error);
        }
    });

    /**
* @openapi
* /api/applications:
*   post:
*     summary: Wysyła nową aplikację na ofertę pracy wraz z plikiem CV
*     tags: [Applications]
*     description: Przetwarza dane formularza i przesyła plik. Emituje 'NEW_APPLICATION' przez WebSockets.
*     requestBody:
*       required: true
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             required:
*               - job_id
*               - first_name
*               - last_name
*               - email
*               - phone
*               - cv_file
*             properties:
*               job_id:
*                 type: integer
*               first_name:
*                 type: string
*               last_name:
*                 type: string
*               email:
*                 type: string
*               phone:
*                 type: string
*               message:
*                 type: string
*               cv_file:
*                 type: string
*                 format: binary
*                 description: Plik PDF/DOC (załącznik z CV)
*     responses:
*       200:
*         description: Sukces.
*       401:
*         description: Niezalogowany (brak sesji/ciastka).
*       422:
*         description: Błąd walidacji danych (np. brak CV lub zły format emaila).
     */
    //WSTAWIENIE CV
   router.post('/', uploadCV.single('cv_file'), (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Musisz być zalogowany, aby wysłać aplikację." });
        }
        
        const loggedInUserId = req.user.id;

            if (req.body.job_id) {
                req.body.job_id = Number(req.body.job_id);
            }
            const validData = new ApplicationModel(req.body);
            
            if (!req.file) {
                throw createError(422, 'Musisz załączyć plik CV!');
            }

            const savedCvLink = '/uploads/' + req.file.filename;
            
            const statement = connection.prepare(`
                INSERT INTO applications (job_id, user_id,first_name, last_name, email, phone, cv_link, message)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            statement.run(
                validData.job_id,
                loggedInUserId,
                validData.first_name, 
                validData.last_name, 
                validData.email, 
                validData.phone, 
                savedCvLink,
                validData.message
            );
            broadcast(['RECRUITER'], { type: 'NEW_APPLICATION' });
            
            res.json({ success: true, message: "Zgłoszenie zapisane z plikiem!" });
        } catch (error) {
            next(error); 
        }
    });

    /**
* @openapi
* /api/applications/my-applications:
*   get:
*     summary: Pobiera listę zgłoszeń wysłanych przez obecnie zalogowanego kandydata
*     tags: [Applications]
*     responses:
*       200:
*         description: Tablica aplikacji należących do zalogowanego użytkownika.
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   id:
*                     type: integer
*                   status:
*                     type: string
*                   created_at:
*                     type: string
*                     format: date-time
*                   job_title:
*                     type: string
*                   company_name:
*                     type: string
*       401:
*         description: Niezalogowany.
     */
    // POBIERANIE APLIKACJI UŻYTKOWNIKA
    router.get('/my-applications', (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Brak dostępu - niezalogowany." });
        }

        const userId = req.user.id;

        const statement = connection.prepare(`
            SELECT 
                a.id, 
                a.status, 
                a.created_at,
                j.title as job_title,
                c.name as company_name
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN companies c ON j.company_id = c.id
            WHERE a.user_id = ?
            ORDER BY a.created_at DESC
        `);

        const myApplications = statement.all(userId);

        res.json(myApplications);
    } catch (error) {
        next(error);
    }
});
    
    return router;
}