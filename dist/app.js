import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Text } from 'ink';
import path from 'path';
import { Welcome } from './components/Welcome.js';
import { Chat } from './components/Chat.js';
import { THEME } from './styles.js';
import { IntroAnimation } from './components/IntroAnimation.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const App = () => {
    const [username, setUsername] = useState(null);
    const [showIntro, setShowIntro] = useState(true);
    // Resolve relative to this file: ../public/the_river.gif
    // In dev: source/app.tsx -> ../public -> root/public
    // In prod: dist/app.js -> ../public -> root/public
    const gifPath = path.join(__dirname, '..', 'public', 'the_river.gif');
    if (showIntro) {
        return (_jsx(IntroAnimation, { filePath: gifPath, onComplete: () => setShowIntro(false), width: 70, height: 20 }));
    }
    return (_jsxs(Box, { flexDirection: "column", padding: 1, width: "100%", children: [!username ? (_jsx(Welcome, { onJoin: setUsername })) : (_jsx(Chat, { username: username })), _jsx(Box, { marginTop: 1, justifyContent: "center", children: _jsx(Text, { color: THEME.white, dimColor: true, children: "River CLI v1.0.0" }) })] }));
};
