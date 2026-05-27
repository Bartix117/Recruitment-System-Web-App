import { Router, Request, Response } from 'express';
import Database from 'better-sqlite3';

export function jobsRouter(connection: Database.Database): Router {
    const router = Router();

    /**
* @openapi
* /api/jobs:
*   get:
*     summary: Pobiera listę wszystkich ofert pracy
*     tags: [Jobs]
*     description: Pobiera wszystkie aktywne oferty pracy z bazy danych wraz z dołączoną nazwą firmy (JOIN).
*     responses:
*       200:
*         description: Lista ofert pracy
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   id:
*                     type: integer
*                   title:
*                     type: string
*                     example: "Senior Frontend Developer"
*                   description:
*                     type: string
*                   salary_range:
*                     type: string
*                     example: "15000 - 20000 PLN"
*                   company_id:
*                     type: integer
*                   company_name:
*                     type: string
*                     example: "TechCorp"
*                   created_at:
*                     type: string
*                     format: date-time
*       500:
*         description: Wewnętrzny błąd serwera.
     */
    // POBIERANIE WSZYSTKICH OFERT
    router.get('/', (req: Request, res: Response) => {
        try {
            const statement = connection.prepare(`
                SELECT jobs.*, companies.name as company_name 
                FROM jobs 
                JOIN companies ON jobs.company_id = companies.id
            `);
            res.json(statement.all());
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Błąd pobierania ofert pracy" });
        }
    });

    /**
* @openapi
* /api/jobs/{id}:
*   get:
*     summary: Pobiera szczegóły pojedynczej oferty pracy
*     tags: [Jobs]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*         description: ID oferty pracy
*     responses:
*       200:
*         description: Szczegóły oferty pracy
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 id:
*                   type: integer
*                 title:
*                   type: string
*                 description:
*                   type: string
*                 salary_range:
*                   type: string
*                 company_id:
*                   type: integer
*                 company_name:
*                   type: string
*       404:
*         description: Nie znaleziono oferty.
*       500:
*         description: Wewnętrzny błąd serwera.
     */
    // POBIERANIE JEDNEJ OFERTY
    router.get('/:id', (req: Request, res: Response) => {
        try {
            const statement = connection.prepare(`
                SELECT jobs.*, companies.name as company_name 
                FROM jobs 
                JOIN companies ON jobs.company_id = companies.id
                WHERE jobs.id = ?
            `);
            const job = statement.get(req.params.id);
            if (job) {
                res.json(job);
            } else {
                res.status(404).json({ error: "Nie znaleziono oferty" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Błąd pobierania oferty" });
        }
    });
    /**
* @openapi
* /api/jobs:
*   post:
*     summary: Dodaje nową ofertę pracy
*     tags: [Jobs]
*     description: Wymaga bycia zalogowanym (Admin/Rekruter). Operacja jest zapisywana w logu audytowym.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - title
*               - description
*               - company_id
*             properties:
*               title:
*                 type: string
*                 description: Nazwa stanowiska
*               description:
*                 type: string
*                 description: Pełny opis oferty
*               salary_range:
*                 type: string
*                 description: Widełki płacowe
*               company_id:
*                 type: integer
*                 description: ID firmy wystawiającej ofertę
*     responses:
*       200:
*         description: Oferta dodana pomyślnie.
*       401:
*         description: Brak dostępu (niezalogowany).
*       500:
*         description: Błąd wewnętrzny.
     */
    //DODANIE OFERTY
    router.post('/', (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ error: "Brak dostępu." });

        const { title, description,location, salary_range, company_id } = req.body;

        const stmt = connection.prepare(`
            INSERT INTO jobs (title, description, salary_range, company_id) 
            VALUES (?, ?, ?, ?)
        `);
        const info = stmt.run(title, description, salary_range, company_id);
        const newJobId = info.lastInsertRowid;
         const auditStmt = connection.prepare(`
            INSERT INTO audit_log (user_id, username, action, details) 
            VALUES (?, ?, ?, ?)
        `);
        let changes = [];
        if (title) changes.push(`Tytuł: ''${title}`);
        if (description) changes.push(`Opis: '${description}'`);
        if (salary_range) changes.push(`Płaca: '${salary_range}'`);
        if (company_id) changes.push(`Id firmy: '${company_id}'`)
        const detailsStr = `Dodano ofertę ID ${newJobId}. Jej dane: ${changes.join(', ')}.`;

        auditStmt.run(req.user.id, req.user.username, 'CREATE_JOB', detailsStr);

        res.json({ success: true, message: "Oferta dodana pomyślnie!" });
    } catch (error) {
        next(error);
    }
});
/**
* @openapi
* /api/jobs/{id}:
*   put:
*     summary: Modyfikuje istniejącą ofertę pracy
*     tags: [Jobs]
*     description: Aktualizuje szczegóły oferty (tytuł, opis, pensja, przypisana firma). Rejestruje dokładne zmiany w tabeli audytu. Wymaga autoryzacji.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*         description: ID oferty do edycji
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               title:
*                 type: string
*               description:
*                 type: string
*               location:
*                 type: string
*               salary_range:
*                 type: string
*               company_id:
*                 type: integer
*     responses:
*       200:
*         description: Oferta zaktualizowana pomyślnie (lub brak zmian do zapisania).
*       401:
*         description: Brak dostępu.
*       404:
*         description: Nie znaleziono oferty.
     */
// MODYFIKACJA OFERTY
router.put('/:id', (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ error: "Brak dostępu." });

        const { title, description, location, salary_range, company_id } = req.body;
        const jobId = Number(req.params.id);

        const safeTitle = title || '';
        const safeDesc = description || '';
        const safeSal = salary_range || null;
        const safeCompId = company_id ? Number(company_id) : null;

        const oldJob: any = connection.prepare('SELECT * FROM jobs WHERE id = ?').get(jobId);
        if (!oldJob) return res.status(404).json({ error: "Nie znaleziono oferty do edycji." });

        let changes = [];
        if (oldJob.title !== safeTitle) changes.push(`tytuł na '${safeTitle}'`);
        if (oldJob.salary_range !== safeSal) changes.push(`pensję na '${safeSal || 'brak'}'`);
        if (oldJob.description !== safeDesc) changes.push(`zmodyfikowano treść opisu`);
        if (oldJob.company_id !== safeCompId) changes.push(`przypisano do innej firmy (ID: ${safeCompId})`);

        if (changes.length === 0) {
            return res.json({ success: true, message: "Brak zmian do zapisania." });
        }

        const detailsStr = `Zaktualizowano ofertę ID ${jobId}. Zmiany: ${changes.join(', ')}.`;

        const stmt = connection.prepare(`
            UPDATE jobs 
            SET title = ?, description = ?, salary_range = ?, company_id = ?
            WHERE id = ?
        `);
        stmt.run(safeTitle, safeDesc, safeSal, safeCompId, jobId);

        const auditStmt = connection.prepare(`
            INSERT INTO audit_log (user_id, username, action, details) 
            VALUES (?, ?, ?, ?)
        `);
        auditStmt.run(req.user.id, req.user.username, 'UPDATE_JOB', detailsStr);

        res.json({ success: true, message: "Oferta zaktualizowana pomyślnie!" });
    } catch (error) {

        console.error("BŁĄD PRZY EDYCJI OFERTY:", error);
        next(error);
    }
});
    /**
* @openapi
* /api/jobs/{id}:
*   delete:
*     summary: Usuwa ofertę pracy
*     tags: [Jobs]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*         description: ID oferty do usunięcia
*     responses:
*       200:
*         description: Oferta usunięta pomyślnie.
*       401:
*         description: Brak dostępu (użytkownik niezalogowany).
*       404:
*         description: Nie znaleziono oferty o podanym ID.
     */
    //USUNIECIE OFERTY PRACY
    router.delete('/:id', (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ error: "Brak dostępu." });
        const jobId = Number(req.params.id);
        const Job: any = connection.prepare('SELECT * FROM jobs WHERE id = ?').get(jobId);
        if (!Job) {
            return res.status(404).json({ error: "Nie znaleziono oferty." });
        }
        const stmt = connection.prepare('DELETE FROM jobs WHERE id = ?');
        const info = stmt.run(req.params.id);
        let changes = [];
        if (Job.title) changes.push(`Tytuł: ''${Job.title}`);
        if (Job.description) changes.push(`Opis: '${Job.description}'`);
        if (Job.salary_range) changes.push(`Płaca: '${Job.salary_range}'`);
        if (Job.company_id) changes.push(`Id firmy: '${Job.company_id}'`)
        if (info.changes === 0) return res.status(404).json({ error: "Nie znaleziono oferty." });
        const detailsStr = `Usunięto ofertę ID ${Job.id}. Jej dane: ${changes.join(', ') }.`;
        const auditStmt = connection.prepare(`
            INSERT INTO audit_log (user_id, username, action, details) 
            VALUES (?, ?, ?, ?)
        `);
        auditStmt.run(req.user.id, req.user.username, 'DELETE_JOB', detailsStr);
        res.json({ success: true, message: "Oferta usunięta." });
    } catch (error) {
        next(error);
    }
});

    return router;
}