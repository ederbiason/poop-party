<div align="center">
    <img 
        src="https://ederbiason-dev.vercel.app/_next/image/?url=%2Fimages%2Fprojects%2Fpoop-party.png&w=384&q=75" 
        alt="Poop party logo" 
        style="border-radius: 20%; width: 300px;" 
    />
</div>

<h1 align="center" style="font-weight: bold;">Poop Party</h1>

Project inspired by a game among friends to count how many times we went to the bathroom throughout an entire year. Initially, we used a WhatsApp group, but I decided to automate this process while learning NestJS in practice.

[🌐 Check it out on live!](https://poop-party.vercel.app/)

## 📋 Features
- Responsive design for mobile devices  
- Smooth animations and transitions  
- Party creation with custom goals and members  
- Track and update your poop count  
- Leave or delete a party anytime  
- Authentication with JWT (JSON Web Token)  
- User-friendly UI with a fun and humorous theme  
- Real-time updates on poop statistics

## 🔧 Technologies
- ViteJS 
- NestJS
- Typescript
- React
- TailwindCSS
- ShadcnUI
- MongoDB
- Firebase
- Zod
- React Hook Form

## 🚀 Getting Started
### Frontend
1. Install dependencies:
```bash
cd frontend

npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open `http://localhost:5173/` with your browser.

### Backend
1. Install dependencies:
```bash
cd backend

npm install
```

2. Run the development server:
```bash
npm run start:dev
```

3. API will start running on `http://localhost:3000/`.

## 📁 Project Structure
```bash
frontend/
├── src/             # Main source folder (Vite)
│   ├── assets/      # Static assets (images, icons, etc.)
│   ├── components/  # Reusable React components
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utilities and third-party integrations
│   ├── types/       # TypeScript types and interfaces
│   ├── utils/       # Helper functions

backend/
├── src/             # Main source folder (NestJS)
│   ├── auth/        # Authentication module (JWT, guards, etc.)
│   ├── parties/     # Parties module (controller, service, and module)
│   ├── users/       # Users module (controller, service, and module)
│   ├── schemas/     # MongoDB schemas and models
```

## 📝 License
This project is under the MIT License.
[MIT](https://github.com/ederbiason/poop-party/blob/main/LICENSE)