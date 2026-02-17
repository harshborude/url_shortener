#  Full Stack URL Shortener

A robust, production-ready URL Shortener application built with a **Node.js/Express** backend and a **React** frontend. It features secure user authentication, persistent data storage with **PostgreSQL**, and containerized database management using **Docker**.

##  Features

* **User Authentication**: Secure Signup and Login using JWT (JSON Web Tokens).
* **Custom Short Links**: Users can generate random short codes or specify their own custom aliases.
* **Dashboard**: View a history of all shortened URLs managed by the logged-in user.
* **Redirection**: Instant 302 redirection from short codes to original URLs.
* **Database Management**: Uses **Drizzle ORM** for type-safe database interactions and schema management.
* **Containerization**: PostgreSQL database runs instantly via Docker Compose.

##  Tech Stack

**Backend**
* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: PostgreSQL
* **ORM**: Drizzle ORM
* **Validation**: Zod
* **Authentication**: JWT & Scrypt (for password hashing)

**Frontend**
* **Framework**: React (Vite)
* **Styling**: CSS Modules / Standard CSS

**DevOps**
* **Docker**: Containerized Database
* **Neon / Render / Vercel**: Deployment-ready configuration

---

##  Installation & Setup

Follow these steps to run the project locally.

### 1. Prerequisites
* Node.js (v18+)
* Docker Desktop (for the database)

### 2. Clone the Repository
```bash
git clone [https://github.com/yourusername/url-shortener.git](https://github.com/yourusername/url-shortener.git)
cd url-shortener
```
## 3. Start the Database

We use Docker to spin up a PostgreSQL instance instantly.

### Bash
```bash
docker compose up -d
```
## 4. Start the Backend

 **Install dependencies**
npm install

 **Create environment file**
 **(Create a file named .env and paste the content below)**

```bash
DATABASE_URL="postgresql://postgres:admin@localhost:5433/postgres"
JWT_SECRET="supersecretkey123"
PORT=8000
```
**Push Schema & Start Server:**
Create tables in the database
npm run db:push

**Start the server**
npm run dev

The Backend should now be running on:
 http://localhost:8000

## 5. Start the Frontend
Open a new terminal, navigate to the frontend folder, and start the React app.
cd ../url-shortener-frontend

 **Install dependencies**
npm install

**Start the app**
npm run dev
--
