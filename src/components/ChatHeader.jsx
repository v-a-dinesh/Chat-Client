// src/components/ChatHeader.jsx
import { useAuth } from '../context/AuthContext';

export default function ChatHeader({ connected }) {
    const { user, logout } = useAuth();

    return (
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                        {user?.username?.[0]?.toUpperCase()}
                    </span>
                </div>
                <span className="font-medium">{user?.username}</span>
            </div>
            <div className="flex items-center space-x-4">
                <span 
                    className={`h-2 w-2 rounded-full ${
                        connected ? 'bg-green-500' : 'bg-red-500'
                    }`} 
                />
                <button
                    onClick={logout}
                    className="text-sm text-red-600 hover:text-red-800"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}