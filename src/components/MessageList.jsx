// src/components/MessageList.jsx
import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function MessageList({ messages }) {
    const messagesEndRef = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`flex ${
                        message.userId === user?.id ? 'justify-end' : 'justify-start'
                    }`}
                >
                    <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.userId === user?.id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                        }`}
                    >
                        <p>{message.text}</p>
                        <span className="text-xs opacity-75">
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}