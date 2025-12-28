import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import Spinner from 'ink-spinner';
import { THEME, GlitchText } from '../styles.js';
import { fetchMessages, sendMessage } from '../api.js';
export const Chat = ({ username }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState('SYNCING');
    useEffect(() => {
        // Initial fetch
        const load = async () => {
            try {
                const msgs = await fetchMessages(50);
                if (msgs)
                    setMessages(msgs);
                setStatus('CONNECTED');
            }
            catch {
                setStatus('ERROR');
            }
            setIsLoading(false);
        };
        load();
        // POLL EVERY 1 SECOND
        const interval = setInterval(async () => {
            try {
                const msgs = await fetchMessages(50);
                if (msgs) {
                    setMessages(msgs); // React handles array ref diffing
                    setStatus('CONNECTED');
                }
            }
            catch {
                setStatus('RECONNECTING...');
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const handleSend = async (val) => {
        if (!val.trim())
            return;
        setInput('');
        // Optimistic UI update
        const tempId = 'temp-' + Date.now();
        const optimisticMsg = { id: tempId, user: username, text: val, timestamp: Date.now() };
        setMessages((prev) => [...prev, optimisticMsg]);
        await sendMessage(username, val);
        // Next poll will sync it properly
    };
    return (_jsxs(Box, { flexDirection: "column", width: 75, height: 25, borderStyle: "bold", borderColor: THEME.dimGreen, children: [_jsxs(Box, { borderStyle: "single", borderBottom: false, borderTop: false, borderLeft: false, borderRight: false, paddingX: 1, justifyContent: "space-between", children: [_jsxs(Box, { children: [_jsx(Text, { color: THEME.dangerRed, bold: true, children: "NET: " }), _jsx(GlitchText, { children: "DARK_RELAY_NODE_0x1" })] }), _jsxs(Box, { children: [_jsx(Text, { color: THEME.gray, dimColor: true, children: "STATUS: " }), _jsxs(Text, { color: status === 'CONNECTED' ? THEME.neonGreen : THEME.dangerRed, children: ["[", status, "]"] })] }), _jsxs(Text, { color: THEME.gray, dimColor: true, children: ["UID: ", username.toUpperCase()] })] }), _jsx(Box, { flexDirection: "column", flexGrow: 1, paddingX: 1, overflowY: "hidden", children: isLoading ? (_jsx(Box, { children: _jsxs(Text, { children: [_jsx(Spinner, { type: "simpleDots" }), _jsx(Text, { color: THEME.dangerRed, children: " INTERCEPTING PACKETS..." })] }) })) : (messages.slice(-18).map((msg) => (_jsxs(Box, { children: [_jsxs(Text, { color: THEME.dimGreen, children: ["[", new Date(msg.timestamp).toLocaleTimeString('en-US', { hour12: false }), "]"] }), _jsxs(Text, { color: msg.user === username ? THEME.neonGreen : THEME.white, children: [_jsxs(Text, { children: [' ', "[", msg.user.substring(0, 8).toUpperCase(), "]: "] }), _jsx(Text, { children: msg.text })] })] }, msg.id)))) }), _jsxs(Box, { borderStyle: "single", borderColor: THEME.gray, borderLeft: false, borderRight: false, borderBottom: false, children: [_jsx(Box, { marginRight: 1, children: _jsx(Text, { color: THEME.dangerRed, bold: true, children: 'root@device: ~$' }) }), _jsx(TextInput, { value: input, onChange: setInput, onSubmit: handleSend, placeholder: "inject_payload..." })] })] }));
};
