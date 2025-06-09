
## Smart Chat-Server

```markdown
# Real-Time Chat Server

A WebSocket-based backend server for real-time chat application with user authentication and message echoing functionality.

## 🚀 Features

- **User Authentication**: JWT-based authentication system
- **WebSocket Communication**: Real-time bidirectional communication
- **Message Echo**: Server echoes back client messages
- **Session Management**: Persistent chat sessions storage
- **RESTful API**: For user authentication and session management
- **Database Integration**: Local database for storing user data and chat history

## 📋 Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn
- MongoDB (for local database) or SQLite

## 🛠️ Installation

1. Clone the repository
```bash
git clone <repository-url>
cd chat-server
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```env
PORT=3001
JWT_SECRET=your_jwt_secret_key_here
DATABASE_URL=mongodb://localhost:27017/chat-app
# For SQLite: DATABASE_URL=sqlite://./database.db
CORS_ORIGIN=http://localhost:3000
```

4. Set up the database
```bash
# For MongoDB
mongod --dbpath /path/to/your/db

# For SQLite (automatic with Prisma/Sequelize)
npm run db:migrate
```

## 🏃‍♂️ Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
chat-server/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── chatController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Session.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── chatRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   └── socketService.js
│   ├── utils/
│   │   ├── database.js
│   │   └── jwt.js
│   ├── app.js
│   └── server.js
├── tests/
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Chat Sessions

#### Get All Sessions
```http
GET /api/sessions
Authorization: Bearer <token>
```

#### Get Session Messages
```http
GET /api/sessions/:sessionId/messages
Authorization: Bearer <token>
```

## 🔌 WebSocket Events

### Client to Server

#### Connection
```javascript
socket.on('connection', (token) => {
  // Authenticate user with JWT token
});
```

#### Send Message
```javascript
socket.emit('message', {
  sessionId: 'session-uuid',
  content: 'Hello, server!'
});
```

#### Join Session
```javascript
socket.emit('join-session', sessionId);
```

### Server to Client

#### Message Echo
```javascript
socket.on('message', (data) => {
  // Echoed message from server
  // { sessionId, content, timestamp, messageId }
});
```

#### Error
```javascript
socket.on('error', (error) => {
  // Handle errors
});
```

## 🗄️ Database Schema

### User Model
```javascript
{
  id: UUID,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Session Model
```javascript
{
  id: UUID,
  userId: UUID (foreign key),
  name: String,
  createdAt: DateTime,
  lastMessageAt: DateTime
}
```

### Message Model
```javascript
{
  id: UUID,
  sessionId: UUID (foreign key),
  content: String,
  sender: Enum ['user', 'server'],
  timestamp: DateTime
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚨 Error Handling

The server implements comprehensive error handling:

- **400**: Bad Request - Invalid input data
- **401**: Unauthorized - Invalid or missing authentication
- **404**: Not Found - Resource not found
- **500**: Internal Server Error - Server-side errors

## 🔒 Security

- JWT tokens for authentication
- Password hashing using bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting on authentication endpoints

## 📦 Dependencies

- **express**: Web framework
- **socket.io**: WebSocket library
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **mongoose/sequelize**: Database ORM
- **dotenv**: Environment variables
- **cors**: Cross-origin resource sharing
- **express-validator**: Input validation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.
```
