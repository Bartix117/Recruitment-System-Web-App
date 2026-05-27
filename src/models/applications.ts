import createError from 'http-errors';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ApplicationModel {
    job_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    message: string | null;

    constructor(data: unknown) {
        if (typeof data !== 'object' || Array.isArray(data) || data == null) {
            throw createError(400, 'Oczekiwano obiektu z danymi');
        }
        
        const obj = data as Record<string, unknown>;

        // Walidacja ID pracy
        if (typeof obj.job_id !== 'number') {
            throw createError(422, 'Brakujące lub nieprawidłowe ID stanowiska');
        }
        this.job_id = obj.job_id;

        // Walidacja imienia i nazwiska
        if (typeof obj.first_name !== 'string' || (this.first_name = obj.first_name.trim()) === '') {
            throw createError(422, 'Imię jest wymagane');
        }
        if (typeof obj.last_name !== 'string' || (this.last_name = obj.last_name.trim()) === '') {
            throw createError(422, 'Nazwisko jest wymagane');
        }

        // Walidacja Email
        if (typeof obj.email !== 'string' || !EMAIL_RE.test(this.email = obj.email.trim())) {
            throw createError(422, 'Podaj poprawny adres e-mail');
        }

        // Walidacja telefonu i linku
        if (typeof obj.phone !== 'string' || (this.phone = obj.phone.trim()) === '') {
            throw createError(422, 'Numer telefonu jest wymagany');
        }

        // Wiadomość jest opcjonalna
        if (obj.message !== undefined && obj.message !== null) {
            if (typeof obj.message !== 'string') throw createError(422, 'Wiadomość musi być tekstem');
            this.message = obj.message.trim();
        } else {
            this.message = null;
        }
    }
}