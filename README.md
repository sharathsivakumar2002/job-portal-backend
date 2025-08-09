# Job Portal Backend

A Node.js + Express.js + MySQL backend for a job portal application that connects **recruiters** and **candidates**.  
Supports job posting, applying for jobs, and managing applications with authentication.

---

## 🚀 Features
- **User Authentication** – Register & login for both recruiters and candidates (JWT-based)
- **Job Management** – Recruiters can post, update, delete jobs
- **Application Management** – Candidates can apply for jobs & view their applications
- **Recruiter Dashboard** – View applicants for specific jobs
- **File Upload** – Resume upload feature for applications
- **MySQL Database** – Structured relational database

---

## 🛠 Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **File Uploads**: Multer
- **Other Tools**: bcrypt.js, dotenv, cors

---

## 📦 Installation
```bash
# Clone the repository
git clone https://github.com/your-username/job-portal-backend.git

# Navigate to project folder
cd job-portal-backend

# Install dependencies
npm install

# Create .env file and configure database credentials
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=job_portal
JWT_SECRET=your_jwt_secret

# Run server (development mode)
npm run dev
