import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { THEME, GlitchText } from '../styles.js';
export const Welcome = ({ onJoin }) => {
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
    return (_jsxs(Box, { flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 1, borderStyle: "round", borderColor: THEME.dimGreen, children: [_jsx(Box, { marginBottom: 1, children: _jsx(Text, { color: THEME.dangerRed, children: skull }) }), _jsx(Box, { marginBottom: 1, children: _jsx(Text, { color: THEME.dangerRed, bold: true, backgroundColor: THEME.darkBlack, children: "[ ACCESS DENIED: OVERRIDE REQUIRED ]" }) }), _jsx(Box, { marginBottom: 2, marginLeft: 2, children: _jsx(GlitchText, { children: "SYSTEM_FAILURE // UNKNOWN ENTITY DETECTED" }) }), _jsxs(Box, { borderStyle: "single", borderColor: THEME.gray, paddingX: 1, children: [_jsx(Box, { marginRight: 1, children: _jsx(Text, { color: THEME.neonGreen, children: "ROOT@DARKNET:~# ./login --user" }) }), _jsx(TextInput, { value: username, onChange: setUsername, onSubmit: onJoin, placeholder: "alias" })] })] }));
};
