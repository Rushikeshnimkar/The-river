import axios from 'axios';
import { z } from 'zod';

const API_URL = 'https://backend-t-chat.vercel.app/api';

// Message Schema
const MessageSchema = z.object({
    id: z.union([z.string(), z.number()]).transform(String),
    user: z.string(),
    text: z.string(),
    timestamp: z.number(),
});

export type Message = z.infer<typeof MessageSchema>;

// Fetch messages
export const fetchMessages = async (limit = 50): Promise<Message[]> => {
    try {
        const response = await axios.get(`${API_URL}/messages`, {
            params: { limit },
        });

        const data = response.data;

        // Handle both array and object responses
        const messagesArray = Array.isArray(data) ? data : data.messages || [];

        return messagesArray.map((msg: any) => ({
            id: String(msg.id),
            user: msg.user || msg.username || 'Unknown',
            text: msg.text || msg.content || msg.message || '',
            timestamp: msg.timestamp || msg.created_at || Date.now(),
        }));
    } catch (error) {
        console.error('Failed to fetch messages:', error);
        return [];
    }
};

// Send a message
export const sendMessage = async (user: string, text: string): Promise<boolean> => {
    try {
        await axios.post(`${API_URL}/messages`, {
            user,
            text,
            timestamp: Date.now(),
        });
        return true;
    } catch (error) {
        console.error('Failed to send message:', error);
        return false;
    }
};
