import { Box, Text } from 'ink';
import React, { useState, useEffect } from 'react';

// Theme Colors
// Theme Colors
export const THEME = {
    neonGreen: '#39ff14',
    dimGreen: '#1a472a', // Darker green for backgrounds/borders
    darkBlack: '#0d0d0d', // Deep black
    dangerRed: '#ff3333', // Warning/Alert
    black: '#000000',
    white: '#f0f0f0',
    gray: '#444444',
};

// Glitch Text Component
export const GlitchText = ({ children }: { children: string }) => {
    const [text, setText] = useState(children);
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.9) {
                const arr = children.split('');
                const idx = Math.floor(Math.random() * arr.length);
                arr[idx] = chars[Math.floor(Math.random() * chars.length)];
                setText(arr.join(''));
                setTimeout(() => setText(children), 100);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [children]);

    return <Text color={THEME.neonGreen}>{text}</Text>;
};

