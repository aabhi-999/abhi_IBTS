IBTS — Intelligent Bus Transportation System

```---> Overview <---```

IBTS (Intelligent Bus Transportation System) is a full-stack web application designed to modernize government bus transportation systems in India. It provides real-time bus tracking, route discovery, fare estimation, and online booking — improving accessibility, transparency, and user experience.

The system follows a modular architecture (MVC pattern) with a Node.js backend and a React-based frontend.

 ```---> Features --->```

1. Bus Search --->  Users can search buses using source and destination cities. 

2. Live Bus Tracking (Core Feature) ---> Track buses in real-time using location-based services.

3. Secure Backend API ---> Structured API with controllers, models, and routes.

4. Seeder Support  ---> Preload database with sample bus, city, and route data.


```---> Problem Statement <---```

No centralized system for government buses
Lack of real-time tracking
Poor user experience compared to private platforms
Low adoption of public transport

``` ---> 🛠️ Tech Stack <--- ```

Backend
 : Node.js, 
Express.js, 
MongoDB.

Frontend : 
React.js ,
Tailwind CSS 

Tools & Utilities : 
Postman (API testing) , 
dotenv (.env config)

📂 Project Structure
```
IBTS/
├── backend/
│   ├── configs/
│   ├── controllers/
│   │   └── buscontroller.js
│   ├── models/
│   │   ├── Bus.js
│   │   ├── City.js
│   │   └── Route.js
│   ├── routes/
│   │   └── busroutes.js
│   ├── .env
│   ├── package.json
│   ├── seeder.js
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── Search.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── .gitignore
└── README.md

```

```⚙️ Setup & Installation```

1. Clone Repository

git clone https://github.com/your-username/ibts.git
cd ibts

2. Backend Setup

cd backend
npm install

Create .env file : 

PORT=5000 

MONGO_URI=your_mongodb_connection

Run server:

npm run dev
3. Frontend Setup
cd frontend
npm install
npm start
🔄 Application Flow
1. Bus Search

User enters source & destination --->
Frontend sends request to backend API--->
Backend fetches matching routes ---> User
2. Data Handling
Models:
Bus.js → Bus details
City.js → City mapping
Route.js → Route connections
3. API Layer
Routes defined in busroutes.js
Logic handled in buscontroller.js
4. Seeder
seeder.js populates database with initial data
🔐 Security Measures
Environment variables for sensitive data
Structured backend separation (MVC)
Input handling via API routes
