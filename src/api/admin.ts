import { Router, Request, Response } from 'express';
import Database from 'better-sqlite3';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const csvUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) cb(null, true);
        else cb(new Error('To nie jest plik CSV!'));
    }
});

const logoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.resolve(__dirname, '../../uploads/logos');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
    }
});
const logoUpload = multer({ 
    storage: logoStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Tylko pliki graficzne!'));
    }
});

export function adminRouter(connection: Database.Database): Router {
    const router = Router();
/**
* @openapi
* /api/admin/upload-csv:
*   post:
*     summary: Masowy import danych (Firmy lub Oferty) z pliku CSV
*     tags: [Admin]
*     description: Pozwala administratorowi na masowe dodawanie firm lub ofert pracy z pliku CSV. Maksymalny rozmiar pliku to 2MB. Akcja zapisuje się w logach audytowych.
*     requestBody:
*       required: true
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*           required:
*             - file
*             - target
*           properties:
*             file:
*               type: string
*               format: binary
*               description: Plik CSV z danymi do zaimportowania
*             target:
*               type: string
*               enum: [jobs, companies]
*               description: Określa, do jakiej tabeli trafią dane
*     responses:
*       200:
*         description: Pomyślnie przetworzono plik CSV.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                 message:
*                   type: string
*                   example: "Przetworzono CSV. Sukces: 10, Błędy: 0"
*       400:
*         description: Błąd walidacji (np. brak pliku CSV).
*       401:
*         description: Brak dostępu (użytkownik niezalogowany lub brak uprawnień).
        */
    // WGRYWANIE CSV
    router.post('/upload-csv', csvUpload.single('file'), (req: any, res: Response, next) => {
    try {
        if (!req.user) return res.status(401).json({ error: "Brak dostępu." });
        if (!req.file) return res.status(400).json({ error: "Brak pliku CSV" });

        const tableTarget = req.body.target;

        const fileContent = req.file.buffer.toString('utf-8');
        const lines = fileContent.split(/\r?\n/); 
        
        let successCount = 0;
        let errorCount = 0;

        const processImport = connection.transaction(() => {
            const insertJob = connection.prepare('INSERT INTO jobs (company_id, title, description, salary_range) VALUES (?, ?, ?, ?)');
            const insertCompany = connection.prepare('INSERT INTO companies (name, location) VALUES (?, ?)');

            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.length === 0) continue;

                const columns = trimmed.split(';');
                
                try {
                    if (tableTarget === 'jobs' && columns.length >= 3) {
                        insertJob.run(Number(columns[0]), columns[1], columns[2], columns[3] || null);
                        successCount++;
                    } else if (tableTarget === 'companies' && columns.length >= 1) {
                        insertCompany.run(columns[0], columns[1] || null);
                        successCount++;
                    } else {
                        errorCount++;
                    }
                } catch (err) {
                    console.error("Błąd zapisu wiersza CSV:", err);
                    errorCount++;
                }
            }
        });

        processImport();

        if (successCount > 0) {
            const targetName = tableTarget === 'companies' ? 'Firm' : 'Ofert pracy';
            const detailsStr = `Masowy import CSV. Dodano pomyślnie: ${successCount} ${targetName}. Błędnych wierszy: ${errorCount}.`;
            
            const auditStmt = connection.prepare(`
                INSERT INTO audit_log (user_id, username, action, details) 
                VALUES (?, ?, ?, ?)
            `);
            auditStmt.run(req.user.id, req.user.username, 'IMPORT_CSV', detailsStr);
        }

        res.json({ success: true, message: `Przetworzono CSV. Sukces: ${successCount}, Błędy: ${errorCount}` });
    } catch (error: any) {
        next(error);
    }
});

    /**
* @openapi
* /api/admin/audit-logs:
*   get:
*     summary: Pobiera ostatnie 100 logów audytowych systemu
*     tags: [Admin]
*     description: Zwraca listę akcji wykonanych przez użytkowników systemu (np. logowania, importy, edycje), posortowaną od najnowszych.
*     responses:
*       200:
*         description: Lista logów audytowych.
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   id:
*                     type: integer
*                   user_id:
*                     type: integer
*                   username:
*                     type: string
*                   action:
*                     type: string
*                   details:
*                     type: string
*                   created_at:
*                     type: string
*                     format: date-time
*       401:
*         description: Brak dostępu (wymagane uprawnienia administratora).
     */
    //POBIERANIE LOGÓW Z BAZY DANYCH
    router.get('/audit-logs', (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ error: "Brak dostępu." });

        const logs = connection.prepare(`
            SELECT * FROM audit_log 
            ORDER BY created_at DESC 
            LIMIT 100
        `).all();
        
        res.json(logs);
    } catch (error) {
        next(error);
    }
});

    /**
* @openapi
* /api/admin/upload-logo:
*   post:
*     summary: Wgrywa logotyp dla konkretnej firmy
*     tags: [Admin]
*     description: Przyjmuje plik graficzny, zapisuje go na serwerze i przypisuje ścieżkę do wskazanej firmy w bazie danych. Wymaga autoryzacji admina.
*     requestBody:
*       required: true
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             required:
*               - logo
*               - company_id
*             properties:
*               logo:
*                 type: string
*                 format: binary
*                 description: Plik graficzny (np. PNG, JPG)
*               company_id:
*                 type: integer
*                 description: ID firmy, do której przypisane zostanie logo
*     responses:
*       200:
*         description: Logo wgrane i przypisane pomyślnie.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Logo firmy zaktualizowane!"
*                 logoUrl:
*                   type: string
*                   example: "/uploads/logos/logo-1678901234-56789.png"
*       400:
*         description: Błąd walidacji (brak pliku lub ID firmy).
*       401:
*         description: Brak dostępu.
*       500:
*         description: Wewnętrzny błąd serwera.
     */
    // WGRYWANIE LOGO FIRMY
    router.post('/upload-logo', logoUpload.single('logo'), (req: Request, res: Response) => {
        try {
            if (!req.user) return res.status(401).json({ error: "Brak dostępu." });
            if (!req.file) return res.status(400).json({ error: "Brak pliku obrazu" });
            const companyId = req.body.company_id;

            if (!companyId) throw new Error("Musisz wybrać firmę!");

            const logoUrl = '/uploads/logos/' + req.file.filename;

            const stmt = connection.prepare('UPDATE companies SET logo_url = ? WHERE id = ?');
            stmt.run(logoUrl, companyId);

        const company: any = connection.prepare('SELECT name FROM companies WHERE id = ?').get(companyId);
        const companyName = company ? company.name : 'Nieznana firma';

        const detailsStr = `Wgrano nowe logo dla firmy: '${companyName}' (ID: ${companyId}).`;

        const auditStmt = connection.prepare(`
            INSERT INTO audit_log (user_id, username, action, details) 
            VALUES (?, ?, ?, ?)
        `);
        auditStmt.run(req.user.id, req.user.username, 'UPDATE_LOGO', detailsStr);

            res.json({ message: "Logo firmy zaktualizowane!", logoUrl });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}