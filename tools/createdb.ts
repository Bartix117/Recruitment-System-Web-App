import Database from 'better-sqlite3';
import { fakerPL as faker} from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const db = new Database('./data/app.sqlite3');

const polishJobTitles = [
    'Młodszy Programista Angular',
    'Backend Developer (Node.js)',
    'Specjalista ds. Marketingu',
    'Project Manager',
    'Analityk Danych',
    'Inżynier DevOps',
    'Księgowa / Księgowy',
    'Specjalista ds. HR',
    'Kierownik Sprzedaży',
    'Grafik Komputerowy'
];

const polishDescriptions = [
    'Szukamy zmotywowanej osoby do naszego zespołu. Oferujemy świetne zarobki i owocowe czwartki!',
    'Dołącz do dynamicznie rozwijającej się firmy. Możliwość pracy w 100% zdalnie lub z biura.',
    'Ciekawe projekty, elastyczne godziny pracy i zgrany zespół. Gwarantujemy kartę Multisport.',
    'Wymagamy chęci do nauki i podstawowej wiedzy. Reszty Cię nauczymy na miejscu w trakcie szkoleń!',
    'Poszukujemy eksperta w swojej dziedzinie. Wymagane min. 3 lata doświadczenia na podobnym stanowisku.'
];

console.log('Rozpoczynam budowę bazy danych od zera...');

db.pragma('foreign_keys = ON');

//usuniecie starych tabel i dodanie nowych
db.exec(`
    DROP TABLE IF EXISTS audit_log;
    DROP TABLE IF EXISTS applications;
    DROP TABLE IF EXISTS jobs;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS companies;

    CREATE TABLE companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT,
        logo_url TEXT
    );

    CREATE TABLE jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        salary_range TEXT,
        company_id INTEGER,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
    );

    CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    roles TEXT NOT NULL DEFAULT '["CANDIDATE"]'
    );


    CREATE TABLE applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    cv_link TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'OCZEKUJĄCE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
    CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    username TEXT,
    action TEXT,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  )
`);
console.log('Czyste tabele zostały utworzone.');
//tworzenie kont domyslnych
async function createusers() {

console.log('Tworzę konta systemowe...');
    const insertUser = db.prepare('INSERT INTO users (username, password_hash, roles) VALUES (?, ?, ?)');

    const adminHash = await bcrypt.hash('admin123', 10);
    insertUser.run('admin', adminHash, JSON.stringify(['ADMIN']));
    console.log('Utworzono konto: ADMIN (admin / admin123)');

    const recruiterHash = await bcrypt.hash('rekruter123', 10);
    insertUser.run('rekruter', recruiterHash, JSON.stringify(['RECRUITER']));
    console.log('Utworzono konto: REKRUTER (rekruter / rekruter123)');

    const candidateHash = await bcrypt.hash('kandydat123', 10);
    insertUser.run('kandydat', candidateHash, JSON.stringify(['CANDIDATE']));
    console.log('Utworzono konto: KANDYDAT (kandydat / kandydat123)');

    const candidate2Hash = await bcrypt.hash('kandydat234', 10);
    insertUser.run('kandydat2', candidate2Hash, JSON.stringify(['CANDIDATE']));
    console.log('Utworzono konto: KANDYDAT2 (kandydat2 / kandydat234)');

}
createusers();
//generowanie danych przy pomocy fakera
console.log('Wypełniam bazę danymi z Fakera...');

const insertCompany = db.prepare('INSERT INTO companies (name, location) VALUES (?, ?)');
const insertJob = db.prepare('INSERT INTO jobs (title, description, salary_range, company_id) VALUES (?, ?, ?, ?)');


// generowanie 10 firm
const companyIds: number[] = [];
for (let i = 0; i < 10; i++) {
    const info = insertCompany.run(faker.company.name(), faker.location.city());
    companyIds.push(info.lastInsertRowid as number);
}

// generowanie 25 ofert pracy
for (let i = 0; i < 25; i++) {
    const randomCompanyId = companyIds[Math.floor(Math.random() * companyIds.length)];
    const minSalary = faker.number.int({ min: 4, max: 9 }) * 1000;
    const maxSalary = minSalary + faker.number.int({ min: 2, max: 5 }) * 1000;

    insertJob.run(
        faker.helpers.arrayElement(polishJobTitles),
        faker.helpers.arrayElement(polishDescriptions),
        `${minSalary} - ${maxSalary} PLN`,
        randomCompanyId
    );
}