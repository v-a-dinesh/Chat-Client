import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadSavedSessions = () => {
      try {
        const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
        setSessions(savedSessions);

        const lastSessionId = localStorage.getItem('currentSession');
        if (lastSessionId) {
          setCurrentSession(lastSessionId);
          const currentSessionData = savedSessions.find(s => s.id === lastSessionId);
          if (currentSessionData && currentSessionData.messages) {
            const sortedMessages = [...currentSessionData.messages].sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            );
            setMessages(sortedMessages);
          }
        }
      } catch (error) {
        console.error('Error loading saved sessions:', error);
        localStorage.setItem('chatSessions', '[]');
        setSessions([]);
      }
    };

    loadSavedSessions();

    const newSocket = io('http://localhost:1337', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('echo', (message) => {
      handleReceivedMessage(message);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleReceivedMessage = (message) => {
    const echoMessage = {
      text: message,
      timestamp: new Date().toISOString(),
      type: 'received',
      id: `received_${Date.now()}_${Math.random()}`
    };

    setMessages(prevMessages => [...prevMessages, echoMessage]);

    if (currentSession) {
      setSessions(prevSessions => {
        const updatedSessions = prevSessions.map(session => {
          if (session.id === currentSession) {
            const updatedMessages = [...(session.messages || []), echoMessage];
            return {
              ...session,
              messages: updatedMessages,
              lastUpdated: new Date().toISOString()
            };
          }
          return session;
        });

        localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
        return updatedSessions;
      });
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (currentSession) {
      localStorage.setItem('currentSession', currentSession);
    }
  }, [currentSession]);

  const createNewSession = () => {
    const newSession = {
      id: `session_${Date.now()}_${Math.random()}`,
      name: `Chat ${sessions.length + 1}`,
      messages: [],
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    setSessions(prevSessions => {
      const updatedSessions = [...prevSessions, newSession];
      localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
      return updatedSessions;
    });

    setCurrentSession(newSession.id);
    setMessages([]);
    localStorage.setItem('currentSession', newSession.id);
  };

  const switchSession = (sessionId) => {
    setCurrentSession(sessionId);
    localStorage.setItem('currentSession', sessionId);
    
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      const sortedMessages = [...(session.messages || [])].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      setMessages(sortedMessages);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket || !currentSession) return;

    const sentMessage = {
      text: inputMessage,
      timestamp: new Date().toISOString(),
      type: 'sent',
      id: `sent_${Date.now()}_${Math.random()}`
    };

    setMessages(prevMessages => [...prevMessages, sentMessage]);

    setSessions(prevSessions => {
      const updatedSessions = prevSessions.map(session => {
        if (session.id === currentSession) {
          const updatedMessages = [...(session.messages || []), sentMessage];
          return {
            ...session,
            messages: updatedMessages,
            lastUpdated: new Date().toISOString()
          };
        }
        return session;
      });
      
      localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
      return updatedSessions;
    });

    socket.emit('message', inputMessage);
    setInputMessage('');
  };

  const clearCurrentChat = () => {
    if (currentSession) {
      setSessions(prevSessions => {
        const updatedSessions = prevSessions.map(session => {
          if (session.id === currentSession) {
            return {
              ...session,
              messages: [],
              lastUpdated: new Date().toISOString()
            };
          }
          return session;
        });
        localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
        return updatedSessions;
      });
      setMessages([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('chatSessions');
    localStorage.removeItem('currentSession');
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    logout();
    navigate('/');
  };

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} bg-white shadow-lg transition-all duration-300 flex flex-col overflow-hidden`}>
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl font-semibold">
                {user?.username?.[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-lg">{user?.username}</h2>
              <p className="text-sm text-blue-100">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={createNewSession}
            className="mt-6 w-full bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2 backdrop-blur-sm transition-colors"
          >
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sortedSessions.map(session => (
            <button
              key={session.id}
              onClick={() => switchSession(session.id)}
              className={`w-full p-4 text-left hover:bg-gray-50 flex items-center space-x-3 ${
                currentSession === session.id 
                  ? 'bg-blue-50 border-l-4 border-blue-600' 
                  : 'border-l-4 border-transparent'
              }`}
            >
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-sm">
                  {session.name[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{session.name}</div>
                <div className="text-xs text-gray-500">
                  {new Date(session.lastUpdated).toLocaleDateString()} {new Date(session.lastUpdated).toLocaleTimeString()}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {session.messages?.length || 0} messages
              </div>
            </button>
          ))}
        </div>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full text-red-600 hover:text-red-700 font-medium py-2 flex items-center justify-center space-x-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
          {currentSession && (
            <button
              onClick={clearCurrentChat}
              className="text-gray-600 hover:text-red-600 text-sm font-medium"
            >
              Clear Chat
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {currentSession ? (
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={msg.id || index}
                  className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                      msg.type === 'sent' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-900'
                    }`}
                  >
                    <p className="break-words">{msg.text}</p>
                    <span className="text-xs opacity-75 mt-1 block">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <svg className="h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg font-medium">Select a chat or create a new one</p>
              <p className="text-sm">to start messaging</p>
            </div>
          )}
        </div>
        {currentSession && (
          <div className="bg-white border-t p-4">
            <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!isConnected}
              />
              <button
                type="submit"
                disabled={!isConnected || !inputMessage.trim()}
                className={`px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  !isConnected || !inputMessage.trim()
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <span>Send</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}