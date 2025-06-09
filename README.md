
## Smart Chat - Client

```markdown
# Real-Time Chat Client

A responsive web application for real-time chat communication with WebSocket support and local storage capabilities.

## 🚀 Features

- **User Authentication**: Secure signup, login, and logout functionality
- **Real-time Messaging**: Instant message sending and receiving via WebSockets
- **Responsive Design**: Adaptive UI for desktop, tablet, and mobile devices
- **Session Management**: Switch between multiple chat sessions
- **Local Storage**: Persist user data and chat history locally
- **Modern UI**: Clean and intuitive chat interface

## 📋 Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn
- Modern web browser with WebSocket support

## 🛠️ Installation

1. Clone the repository
```bash
git clone <repository-url>
cd chat-client
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WS_URL=ws://localhost:3001
```

## 🏃‍♂️ Running the Application

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
npm install -g serve
serve -s build
```

## 📁 Project Structure

```
chat-client/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── AuthForm.css
│   │   ├── Chat/
│   │   │   ├── ChatContainer.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   └── Chat.css
│   │   ├── Session/
│   │   │   ├── SessionList.jsx
│   │   │   ├── SessionItem.jsx
│   │   │   └── Session.css
│   │   └── Layout/
│   │       ├── Header.jsx
│   │       ├── Sidebar.jsx
│   │       └── Layout.css
│   ├── contexts/
│   │   ├── AuthContext.js
│   │   └── SocketContext.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useSocket.js
│   │   └── useLocalStorage.js
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── socket.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── storage.js
│   ├── styles/
│   │   ├── global.css
│   │   └── variables.css
│   ├── App.js
│   ├── App.css
│   └── index.js
├── tests/
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 🎨 UI Components

### Authentication Pages
- **Login Page**: Email/username and password fields with validation
- **Signup Page**: Registration form with username, email, and password
- **Protected Routes**: Automatic redirection for unauthenticated users

### Chat Interface
- **Message List**: Scrollable message history with timestamps
- **Message Input**: Text input with send button and Enter key support
- **Status Indicators**: Connection status and typing indicators
- **Message States**: Sent, delivered, and error states

### Session Management
- **Session Sidebar**: List of all chat sessions
- **Active Session**: Highlighted current session
- **Session Actions**: Create new session, delete session
- **Session Info**: Last message preview and timestamp

## 🔌 WebSocket Integration

```javascript
// Initialize WebSocket connection
const socket = io(WEBSOCKET_URL, {
  auth: {
    token: localStorage.getItem('authToken')
  }
});

// Send message
socket.emit('message', {
  sessionId: currentSessionId,
  content: messageText
});

// Receive echoed message
socket.on('message', (data) => {
  // Update message list
});
```

## 💾 Local Storage Schema

```javascript
// User Authentication
localStorage.setItem('authToken', token);
localStorage.setItem('user', JSON.stringify(userData));

// Chat Sessions
localStorage.setItem('sessions', JSON.stringify(sessions));

// Messages Cache
localStorage.setItem(`messages_${sessionId}`, JSON.stringify(messages));
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations
- Collapsible sidebar
- Touch-friendly UI elements
- Optimized keyboard behavior
- Swipe gestures for navigation

## 🎨 Theming

The application supports custom theming through CSS variables:

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --background-color: #f8f9fa;
  --text-color: #333333;
  --border-color: #dee2e6;
  --message-user-bg: #007bff;
  --message-server-bg: #e9ecef;
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 🔧 Configuration

### Environment Variables
- `REACT_APP_API_URL`: Backend API endpoint
- `REACT_APP_WS_URL`: WebSocket server URL
- `REACT_APP_STORAGE_PREFIX`: Local storage key prefix

## 📦 Dependencies

### Core
- **react**: UI library
- **react-dom**: React DOM renderer
- **react-router-dom**: Routing library

### Communication
- **socket.io-client**: WebSocket client
- **axios**: HTTP client

### UI/UX
- **styled-components** or **emotion**: CSS-in-JS
- **react-icons**: Icon library
- **react-toastify**: Notifications

### Utilities
- **date-fns**: Date formatting
- **uuid**: Unique ID generation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.
```
