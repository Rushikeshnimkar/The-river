import React, { useState } from 'react';
import { Box, Text } from 'ink';
import path from 'path';
import { Welcome } from './components/Welcome.js';
import { Chat } from './components/Chat.js';
import { THEME } from './styles.js';
import { IntroAnimation } from './components/IntroAnimation.js';

export const App = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [showIntro, setShowIntro] = useState(true);
    const gifPath = path.join(process.cwd(), 'public', 'the_river.gif');

    if (showIntro) {
        return (
            <IntroAnimation
                filePath={gifPath}
                onComplete={() => setShowIntro(false)}
                width={70}
                height={20}
            />
        );
    }

    return (
        <Box flexDirection="column" padding={1} width="100%">
            {!username ? (
                <Welcome onJoin={setUsername} />
            ) : (
                <Chat username={username} />
            )}

            {/* Footer / Credits */}
            <Box marginTop={1} justifyContent="center">
                <Text color={THEME.white} dimColor>
                    River CLI v1.0.0
                </Text>
            </Box>
        </Box>
    );
};
