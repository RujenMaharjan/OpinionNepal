# Opinion Nepal

**Opinion Nepal** is a MERN stack-based full-stack web application that empowers users to express opinions, initiate petitions, and engage in civic dialogue through structured commenting. It is designed to give a voice to individuals whose views may otherwise be lost in the noise of traditional social media.

---

## 🔧 Installation and Setup

> **Note:** `node_modules` are excluded from Git for both client and server. Run the following commands to install dependencies.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/opinion-nepal.git
cd opinion-nepal

# For client (frontend)
cd client
npm install

# For server (backend)
cd ../server
npm install

# Run backend server
cd server
npm start

# Run frontend client
cd ../client
npm run dev

🌟 Features
•	🔐 User registration and login
•	🧾 Post opinions with an optional image
•	💬 Structured commenting system:
    • Supporter’s Voice
    • Opposer’s Voice
    • Alternative Solution
•	📢 Petition creation and support
•	🔎 Search for users and opinions
•	📈 Trending hashtags
•	🧑‍💼 Dynamic profile management
•	📸 Upload profile/cover photos
 
🧰 Tech Stack
•	Frontend: React.js, Context API
•	Backend: Node.js, Express.js
•	Database: MongoDB (Mongoose)
•	Media Uploads: Cloudinary
•	State Management: Context API



📁 Project Structure
opinion-nepal/
│
├── client/             # Frontend (React)
│   └── src/
│       └── components/
│       └── pages/
│       └── context/
│       └── App.js
│
├── server/             # Backend (Node + Express)
│   └── controllers/
│   └── models/
│   └── routes/
│   └── server.js
│   └── .env            # Environment variables (change accordingly)



