import { Router, Request, Response } from 'express';
import Database from 'better-sqlite3';

export function companiesRouter(connection: Database.Database): Router {
    const router = Router();
    /**
* @openapi
* /api/companies:
*   get:
*     summary: Pobiera listę wszystkich firm
*     tags: [Companies]
*     description: Zwraca tablicę obiektów reprezentujących firmy w systemie.
*     responses:
*       200:
*         description: Sukces. Lista firm.
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   id:
*                     type: integer
*                     example: 1
*                   name:
*                     type: string
*                     example: "TechCorp"
*                   location:
*                     type: string
*                     example: "Warszawa"
*                   logo_url:
*                     type: string
*                     example: "/uploads/logos/logo-123.png"
*       500:
*         description: Błąd pobierania firm z bazy danych.
     */
    //WYCIAGANIE INFORMACJI O FIRMACH
    router.get('/', (req: Request, res: Response) => {
        try {
            const statement = connection.prepare('SELECT * FROM companies');
            res.json(statement.all());
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Błąd pobierania firm" });
        }
    });
/**
* @openapi
* /api/companies:
*   post:
*     summary: Dodaje nową firmę do bazy
*     tags: [Companies]
*     description: Tworzy nowy rekord firmy. Akcja jest logowana w systemie audytu.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - name
*             properties:
*               name:
*                 type: string
*                 description: Nazwa firmy
*               location:
*                 type: string
*                 description: Lokalizacja / miasto
*               logo_url:
*                 type: string
*                 description: Ścieżka do wgranego wcześniej pliku z logo
*     responses:
*       200:
*         description: Firma dodana pomyślnie.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                 message:
*                   type: string
*       401:
*         description: Brak dostępu (użytkownik niezalogowany).
     */
//DODANIE FIRMY
 router.post('/', (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ error: "Brak dostępu." });

        const { name, location, logo_url } = req.body;

        const stmt = connection.prepare(`
            INSERT INTO companies (name, location, logo_url) 
            VALUES (?, ?, ?)
        `);
        
        const info = stmt.run(name, location || null, logo_url || null);
        
        const newCompanyId = info.lastInsertRowid;
        
        let changes = [];
        if (name) changes.push(`Nazwa: '${name}'`);
        if (location) changes.push(`Lokalizacja: '${location}'`);
        if (logo_url) changes.push(`Logo URL: '${logo_url}'`);
        
        const detailsStr = `Dodano firmę ID ${newCompanyId}. Jej dane: ${changes.join(', ')}.`;

        const auditStmt = connection.prepare(`
            INSERT INTO audit_log (user_id, username, action, details) 
            VALUES (?, ?, ?, ?)
        `);
        auditStmt.run(req.user.id, req.user.username, 'CREATE_COMPANY', detailsStr);
        
        res.json({ success: true, message: "Firma dodana pomyślnie!" });
    } catch (error) {
        next(error);
    }
});
/**
* @openapi
* /api/companies/{id}:
*   put:
*     summary: Modyfikuje dane istniejącej firmy
*     tags: [Companies]
*     description: Aktualizuje informacje o firmie na podstawie przekazanego ID. Zmiany są analizowane i zapisywane w logach audytowych.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*         description: ID firmy do edycji
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - name
*             properties:
*               name:
*                 type: string
*               location:
*                 type: string
*               logo_url:
*                 type: string
*     responses:
*       200:
*         description: Firma zaktualizowana pomyślnie (lub brak zmian do zapisania).
*       401:
*         description: Brak dostępu.
*       404:
*         description: Nie znaleziono firmy o podanym ID.
     */
// MODYFIKACJA FIRMY 
router.put('/:id', (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ error: "Brak dostępu." });

        const { name, location, logo_url } = req.body;
        const companyId = Number(req.params.id);

        const oldCompany: any = connection.prepare('SELECT * FROM companies WHERE id = ?').get(companyId);
        if (!oldCompany) return res.status(404).json({ error: "Nie znaleziono firmy do edycji." });

        let changes = [];
        if (oldCompany.name !== name) {
            changes.push(`nazwę z '${oldCompany.name}' na '${name}'`);
        }
        if (oldCompany.location !== (location || null)) {
            changes.push(`lokalizację z '${oldCompany.location || 'brak'}' na '${location || 'brak'}'`);
        }
        if (oldCompany.logo_url !== (logo_url || null)) {
            changes.push(`zmieniono logo`);
        }

        if (changes.length === 0) {
            return res.json({ success: true, message: "Brak zmian do zapisania." });
        }

        const detailsStr = `Zaktualizowano firmę ID ${companyId}. Zmiany: ${changes.join(', ')}.`;

        const stmt = connection.prepare(`
            UPDATE companies 
            SET name = ?, location = ?, logo_url = ?
            WHERE id = ?
        `);
        stmt.run(name, location || null, logo_url || null, companyId);

        const auditStmt = connection.prepare(`
            INSERT INTO audit_log (user_id, username, action, details) 
            VALUES (?, ?, ?, ?)
        `);
        auditStmt.run(req.user.id, req.user.username, 'UPDATE_COMPANY', detailsStr);

        res.json({ success: true, message: "Firma zaktualizowana pomyślnie!" });
    } catch (error) {
        next(error);
    }
});
/**
* @openapi
* /api/companies/{id}:
*   delete:
*     summary: Usuwa firmę
*     tags: [Companies]
*     description: Usuwa wskazaną firmę z bazy danych. Operacja nie powiedzie się, jeśli do firmy przypisane są aktywne oferty pracy (błąd klucza obcego).
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*         description: ID firmy do usunięcia
*     responses:
*       200:
*         description: Firma usunięta pomyślnie.
*       400:
*         description: Nie można usunąć firmy (naruszenie więzów integralności - firma posiada oferty).
*       401:
*         description: Brak dostępu.
*       404:
*         description: Nie znaleziono firmy do usunięcia.
     */
//USUNIECIE FIRMY
router.delete('/:id', (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ error: "Brak dostępu." });

        const companyId = Number(req.params.id);

        const deletedCompany: any = connection.prepare('SELECT * FROM companies WHERE id = ?').get(companyId);
        
        if (!deletedCompany) {
            return res.status(404).json({ error: "Nie znaleziono firmy." });
        }

        const stmt = connection.prepare('DELETE FROM companies WHERE id = ?');
        const info = stmt.run(companyId);

        if (info.changes === 0) return res.status(404).json({ error: "Nie znaleziono firmy." });

        let changes = [];
        if (deletedCompany.name) changes.push(`Nazwa: '${deletedCompany.name}'`);
        if (deletedCompany.location) changes.push(`Lokalizacja: '${deletedCompany.location}'`);
        if (deletedCompany.logo_url) changes.push(`Logo URL: '${deletedCompany.logo_url}'`);
        
        const detailsStr = `Usunięto firmę ID ${companyId}. Jej dane: ${changes.join(', ')}.`;

        const auditStmt = connection.prepare(`
            INSERT INTO audit_log (user_id, username, action, details) 
            VALUES (?, ?, ?, ?)
        `);
        auditStmt.run(req.user.id, req.user.username, 'DELETE_COMPANY', detailsStr);

        res.json({ success: true, message: "Firma usunięta." });
    } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
             return res.status(400).json({ error: "Nie można usunąć firmy, która posiada oferty pracy!" });
        }
        next(error);
    }
});

    return router;
}