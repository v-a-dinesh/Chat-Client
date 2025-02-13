// src/hooks/useWebSocket.js
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export function useWebSocket() {
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        const socket = io('https://chat-server-z4cd.onrender.com', {
            transports: ['websocket', 'polling'],
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to WebSocket');
            setConnected(true);
        });

        socket.on('message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket');
            setConnected(false);
        });

        // Load messages from localStorage
        const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        setMessages(savedMessages);

        return () => {
            socket.close();
        };
    }, []);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    const sendMessage = (message) => {
        if (socketRef.current && connected) {
            socketRef.current.emit('chatMessage', message);
        }
    };

    return { messages, connected, sendMessage };
}