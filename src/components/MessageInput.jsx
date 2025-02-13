// src/components/MessageInput.jsx
import { useState } from 'react';

export default function MessageInput({ onSendMessage, disabled }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border-t border-gray-200 px-4 py-4">
            <div className="relative flex">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-4 bg-gray-100 rounded-lg py-3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={disabled}
                />
                <div className="absolute right-0 items-center inset-y-0 flex">
                    <button
                        type="submit"
                        disabled={disabled || !message.trim()}
                        className={`inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white ${
                            disabled || !message.trim()
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                        } focus:outline-none`}
                    >
                        Send
                    </button>
                </div>
            </div>
        </form>
    );
}