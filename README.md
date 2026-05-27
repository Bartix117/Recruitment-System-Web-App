# Recruitment System Web App

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

A modern, full-stack Applicant Tracking System (ATS) built to streamline the hiring process. Featuring a responsive Angular frontend and a robust Node.js/Express backend, the system is tailored for Candidates, Recruiters, and Administrators, offering real-time updates, analytics, and comprehensive management tools.

![Recruiter Panel (dark mode)](./assets/Recruiter_Panel(dark_mode).png)
![Admin Panel (light mode)](./assets/Admin_Panel_(light_mode).png)
![Job Offer (light mode)](./assets/Job_Offer(light_mode).png)

## ✨ Features

* **Role-Based Access Control (RBAC):** Distinct dashboards and permissions for Candidates (applying, history), Recruiters (managing applications, charts), and Admins (system structure, audit logs).
* **Real-Time Notifications:** Powered by WebSockets. Recruiters receive live UI toasts for incoming applications, and candidates see status changes instantly without refreshing the page.
* **Interactive Analytics & Exports:** Features dynamic data visualization using `Chart.js` and allows recruiters to generate and download comprehensive applicant reports as PDFs using `pdf-lib`.
* **Mass Data Import:** Administrators can upload CSV files (up to 2MB) to perform bulk inserts of job offers and companies.
* **Comprehensive Audit Logs:** Automated background tracking of administrative CRUD operations (e.g., changes in job details or company metadata) to maintain system integrity.
* **Modern UI/UX:** Built with Angular, featuring a responsive design and an integrated Light/Dark mode toggle (state preserved via `localStorage`).
* **Secure Authentication:** Cookie-based session management handled securely via `Passport.js`.

## 🛠️ Technologies Used

**Frontend**
* **Angular** - For the dynamic Single Page Application.
* **Chart.js** - For rendering interactive recruiter statistics.
* **pdf-lib** - For client-side PDF document generation.

**Backend & Database**
* **Node.js & Express** - Core RESTful API server.
* **better-sqlite3** - Fast, synchronous SQLite database driver enforcing foreign key constraints.
* **ws (WebSockets)** - For bi-directional, real-time event broadcasting.
* **Passport.js** - Local strategy authentication.

**Documentation**
* **OpenAPI / Widdershins** - Auto-generated, interactive 3-column API documentation.

## 📂 Project Structure

```text
├── frontend/             # Angular application source code
├── src/                  # Node.js, Express, and WebSocket server (Backend)
├── docs/                 # Functional Requirements (PDF) & API Documentation
└── README.md             # You are here
```

## Getting Started

### Prerequisites
* Node.js (v18 or higher)
* Angular CLI (`npm install -g @angular/cli`)

### Backend Setup
1. Navigate to the `/src` directory.
2. Install dependencies: `npm install`
3. Duplicate `.env.example` to `.env` and configure your environment variables.
4. Run the server: `npm run dev` (Runs on `http://localhost:3000`)

### Frontend Setup
1. Navigate to the `/frontend` directory.
2. Install dependencies: `npm install`
3. Run the application: `ng serve` (Runs on `http://localhost:4200`)

## 📖 Documentation

Full Functional Requirements Specification (PDF) and comprehensive API endpoints documentation can be found in the `/docs` directory.