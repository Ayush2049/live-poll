## 💡 Why I Built This

While exploring real-time systems and interactive web applications, I noticed that most online polling tools are either **overly complex, require authentication**, or **do not update results in real time**.  
In many situations — classrooms, group discussions, quick decision-making, or live sessions — people just want a **simple, fair, and instant way to vote** without friction.

That’s when I decided to build **LivePoll**.

The goal was clear:
- No login
- No page refresh
- No hidden manipulation
- Real-time transparency

**LivePoll is my attempt to design a lightweight yet reliable real-time polling system that focuses on fairness, simplicity, and instant feedback.**

---

# 🗳️ LivePoll — Real-Time Polling Platform

> A real-time, anonymous polling application with live result updates and fairness enforcement

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-latest-brightgreen.svg)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-real--time-black.svg)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🎯 Overview

LivePoll is a full-stack web application that allows users to:

- Create polls instantly
- Share polls using a single link
- Vote anonymously
- See results update live for everyone
- Prevent duplicate or unfair voting

The system is designed to be **fast, transparent, and fair**, without relying on user accounts or authentication.

---

## 🌟 Features

### 📝 Poll Creation
- Create custom poll questions
- Minimum of 2 options required
- Unlimited additional options
- Time-based poll expiration
- Instant generation of shareable poll links

---

### 🔗 Shareable Poll Links
- Each poll has a unique URL
- Anyone with the link can participate
- No login or registration required
- Easy distribution via messaging or social platforms

---

### ⚡ Real-Time Result Updates
- Live vote updates using Socket.IO
- All connected users see changes instantly
- No page refresh required
- Poll state remains synchronized across devices

**Real-time flow:**
User opens poll
→ Socket connection established
→ Client joins poll room
→ Vote submitted
→ Server updates data
→ All users receive updated results



---

### ⚖️ Fair Voting System

LivePoll ensures vote integrity using multiple protection layers.

#### ✔ One Vote Per Device
- Unique `deviceToken` stored in `localStorage`
- Sent with each vote request
- Enforced via compound unique index: `(pollId + deviceToken)`
- Same device can vote in different polls, not twice in the same poll

#### ✔ Database-Level Protection
- MongoDB unique index prevents duplicates
- Race-condition safe
- Backend enforced (cannot be bypassed from UI)

#### ✔ IP Throttling
- Max 5 votes per IP per poll in 10 minutes
- Prevents spam and automated voting bursts

#### ✔ API Rate Limiting
- Express rate limiter on vote endpoint
- Protects against request flooding and brute-force attempts

#### ✔ Server-Side Validation
Each vote is validated to ensure:
- Poll exists
- Poll is active (not expired)
- Option is valid
- Device has not voted before

---

### ⏳ Automatic Poll Expiration
- Polls auto-expire at defined time
- Backend blocks late votes
- UI reflects inactive state
- Real-time updates stop after expiry

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|-----------|
| **Frontend** | React (Vite), React Router |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Real-Time** | Socket.IO |
| **Security** | Helmet, CORS |
| **State Handling** | Backend + WebSocket Sync |

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- Git

---
### Step-by-Step Setup

#### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/livepoll.git
cd livepoll
2️⃣ Install dependencies
Backend
cd backend
npm install
Frontend
cd frontend
npm install
3️⃣ Configure Environment Variables
Backend .env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
Frontend .env
VITE_API_URL=http://localhost:5000/api
4️⃣ Start the application
Backend
npm run dev
Frontend
npm run dev

````
---

## 📝 Usage Guide

### Create a Poll
- Enter question  
- Add options  
- Set expiration time  

### Share the Poll
- Copy link  
- Send to participants  

### Vote
- One vote per device  
- Backend validation enforced  

### View Results
- Updates instantly  
- No page refresh required  

---


## 🌍 Deployment

LivePoll is deployed using modern cloud platforms to ensure scalability, reliability, and secure HTTPS access.

---

### 🚀 Live Demo

- **Frontend (Vercel):**  
  https://live-poll-three.vercel.app/

- **Backend API (Render):**  
  https://live-poll-lmnk.onrender.com

---

## 🖥️ Frontend Deployment (Vercel)

**Configuration**

- Root Directory: `frontend/`
- Framework: Vite (React)

**Environment Variable**

```env
VITE_API_URL=https://live-poll-lmnk.onrender.com/api
```

Vercel automatically handles:
- Production build
- HTTPS
- CDN distribution
- Auto-redeploy on every push

---

## ⚙️ Backend Deployment (Render)

**Configuration**

- Service Type: Web Service
- Root Directory: `backend/`
- Runtime: Node.js

**Build Command**

```bash
npm install
```

**Start Command**

```bash
npm start
```

**Environment Variables**

```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
CLIENT_URL=https://live-poll-three.vercel.app
```

Render provides:
- Automatic HTTPS
- Continuous deployment
- Managed Node.js hosting

---

