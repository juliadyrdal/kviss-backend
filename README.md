# Kviss Backend 🎮⚡

Backend for **Kviss**, a real-time multiplayer quiz app with AI-generated questions.  
Built with Node.js, Express, Socket.io, and MongoDB Atlas. Integrates with OpenAI GPT-4o to generate quiz content.  

---

## ✨ Features
- ⚡ Real-time multiplayer game logic with Socket.io 
- 🤖 Dynamic quiz generation using OpenAI GPT-4o
- 📊 MongoDB Atlas for persistent data storage  
- 🔄 Synchronised question flow so all players advance together  
- 🧪 API endpoints for quiz creation and joining 

---

## 📡 Status
🚧 **Work in Progress**  
- ✅ Core gameplay loop (create quiz, join quiz, synced rounds)  
- ✅ OpenAI GPT-4o prompt/response handling with validation  
- ✅ Socket.io events for multiplayer sync
- 🔜 Expanded question variety and randomness  

---

## 🛠️ Tech Stack
- Node.js
- Express
- Socket.io
- Mongoose
- MongoDB Atlas 
- OpenAI API

---


## 🚀 Getting Started

### Setup
Clone the repository and install dependencies:

```bash
git clone https://github.com/juliadyrdal/kviss-backend.git
cd kviss-backend
npm install
```

### Environment variables
Create a .env file in the root with:
```bash
MONGODB_URI=your-mongodb-connection
OPENAI_API_KEY=your-openai-api-key
PORT=5000
```

### Development
Run the server locally:
```bash
npm run dev
```
