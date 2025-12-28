import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { THEME, GlitchText } from '../styles.js';

interface WelcomeProps {
    onJoin: (username: string) => void;
}

export const Welcome = ({ onJoin }: WelcomeProps) => {
    const [username, setUsername] = useState('');

    const skull = `
      _______
    .        .
   /          \\
  |   O    O   |
  |     ^      |
   \\  \\__/  /
    '......'
    `;

    return (
        <Box flexDirection="column" alignItems="center" justifyContent="center" padding={1} borderStyle="round" borderColor={THEME.dimGreen}>

            <Box marginBottom={1}>
                <Text color={THEME.dangerRed}>
                    {skull}
                </Text>
            </Box>

            <Box marginBottom={1}>
                <Text color={THEME.dangerRed} bold backgroundColor={THEME.darkBlack}>
                    [ ACCESS DENIED: OVERRIDE REQUIRED ]
                </Text>
            </Box>

            <Box marginBottom={2} marginLeft={2}>
                <GlitchText>SYSTEM_FAILURE // UNKNOWN ENTITY DETECTED</GlitchText>
            </Box>

            <Box borderStyle="single" borderColor={THEME.gray} paddingX={1}>
                <Box marginRight={1}>
                    <Text color={THEME.neonGreen}>ROOT@DARKNET:~# ./login --user</Text>
                </Box>
                <TextInput
                    value={username}
                    onChange={setUsername}
                    onSubmit={onJoin}
                    placeholder="alias"
                />
            </Box>
        </Box>
    );
};
