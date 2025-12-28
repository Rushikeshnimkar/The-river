import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import Spinner from 'ink-spinner';
import { THEME, GlitchText } from '../styles.js';
import { Message, fetchMessages, sendMessage } from '../api.js';

interface ChatProps {
    username: string;
}

export const Chat = ({ username }: ChatProps) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState('SYNCING');

    useEffect(() => {
        // Initial fetch
        const load = async () => {
            try {
                const msgs = await fetchMessages(50);
                if (msgs) setMessages(msgs);
                setStatus('CONNECTED');
            } catch {
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
            } catch {
                setStatus('RECONNECTING...');
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleSend = async (val: string) => {
        if (!val.trim()) return;
        setInput('');

        // Optimistic UI update
        const tempId = 'temp-' + Date.now();
        const optimisticMsg = { id: tempId, user: username, text: val, timestamp: Date.now() };

        setMessages((prev) => [...prev, optimisticMsg]);
        await sendMessage(username, val);
        // Next poll will sync it properly
    };

    return (
        <Box flexDirection="column" width={75} height={25} borderStyle="bold" borderColor={THEME.dimGreen}>
            {/* Header */}
            <Box borderStyle="single" borderBottom={false} borderTop={false} borderLeft={false} borderRight={false} paddingX={1} justifyContent="space-between">
                <Box>
                    <Text color={THEME.dangerRed} bold>NET: </Text>
                    <GlitchText>DARK_RELAY_NODE_0x1</GlitchText>
                </Box>
                <Box>
                    <Text color={THEME.gray} dimColor>STATUS: </Text>
                    <Text color={status === 'CONNECTED' ? THEME.neonGreen : THEME.dangerRed}>
                        [{status}]
                    </Text>
                </Box>
                <Text color={THEME.gray} dimColor>UID: {username.toUpperCase()}</Text>
            </Box>

            {/* Log Stream */}
            <Box flexDirection="column" flexGrow={1} paddingX={1} overflowY="hidden">
                {isLoading ? (
                    <Box>
                        <Text>
                            <Spinner type="simpleDots" />
                            <Text color={THEME.dangerRed}> INTERCEPTING PACKETS...</Text>
                        </Text>
                    </Box>
                ) : (
                    messages.slice(-18).map((msg) => (
                        <Box key={msg.id}>
                            <Text color={THEME.dimGreen}>
                                [{new Date(msg.timestamp).toLocaleTimeString('en-US', { hour12: false })}]
                            </Text>
                            <Text color={msg.user === username ? THEME.neonGreen : THEME.white}>
                                <Text>{' '}[{msg.user.substring(0, 8).toUpperCase()}]: </Text>
                                <Text>{msg.text}</Text>
                            </Text>
                        </Box>
                    ))
                )}
            </Box>

            {/* Input */}
            <Box borderStyle="single" borderColor={THEME.gray} borderLeft={false} borderRight={false} borderBottom={false}>
                <Box marginRight={1}>
                    <Text color={THEME.dangerRed} bold>{'root@device: ~$'}</Text>
                </Box>
                <TextInput
                    value={input}
                    onChange={setInput}
                    onSubmit={handleSend}
                    placeholder="inject_payload..."
                />
            </Box>
        </Box>
    );
};
