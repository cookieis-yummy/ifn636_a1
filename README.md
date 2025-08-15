**Campus Complaint Management System**

**Overview:**
A lightweight full-stack app for campuses to create, view, update, and delete complaints. It supports user access, status tracking, and post-resolution feedbacks and ratings. Designed for easy deployment to AWS EC2 with a public IP and quick local runs.

---

**Project Setup Instructions**

1. **Clone** 

git clone https://github.com/cookieis-yummy/ifn636_a1

cd ifn636_a1

2. **(May requrie) Edit /backend/.env**

MONGO_URI=<your_mongo_connection_string>

JWT_SECRET=<your_jwt_secret>

PORT=5001

4. **Open frontend/src/axiosConfig.jsx and set the API base URL** 

AWS EC2 (using your public IP):

export default axios.create({

  baseURL: 'http://13.236.85.224',   // live
 
  headers: { 'Content-Type': 'application/json' },

});


Local development (backend on port 5001):

// frontend/src/axiosConfig.jsx

import axios from 'axios';

export default axios.create({

  baseURL: 'http://localhost:5001', //local

  headers: { 'Content-Type': 'application/json' },

});

4. **Install dependencies for both backend and frontend**

npm run install-all

5. **Start backend and frontend**

npm run 

7. **Access the App via**

**Current Live Version: http://13.236.85.224/**
**OR**
**Local:** http://localhost:3000 

8. **Test Feedback Feature**
Feedback feature will only be activated when the status is changed to **"closed"**, to test it, you **must login using below account**, or change the status to "closed" manually in Mongodb:
* Login: feedback@test.com
* Password: 1

---

**Key Features**
* Secure sign-up / login, profile management
* Create, view, update, delete own complaints with attachments
* Post-resolution rating & comments

---
 **Tech Stack**
* Frontend Developement: React.js
* Backend Developement: Node.js + Express
* Database: MongoDB
* Auth: JWT
* CI/CD Integration: GitHub
* HTTP Client: Axios

---

**Prerequisite: Please install the following software and create account in following web tools**

* Nodejs [https://nodejs.org/en]
* Git [https://git-scm.com/]
* VS code editor [https://code.visualstudio.com/]
* MongoDB Account [https://account.mongodb.com/account/login] 
* GitHub Account [https://github.com/signup?source=login]
