import multer from 'multer';
import path from 'path';
import fs from 'fs';
import createError from 'http-errors';

const uploadDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, 'cv-' + uniqueSuffix + ext);
    }
});

export const uploadCV = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max 5 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype.includes('word')) {
            cb(null, true);
        } else {
            cb(createError(422, 'Niedozwolony format. Wgraj plik PDF lub DOCX.'));
        }
    }
});