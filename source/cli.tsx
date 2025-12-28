#!/usr/bin/env node
import 'dotenv/config'; // Load env vars
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import { App } from './app.js';

// @ts-ignore
import clear from 'console-clear';

const cli = meow(
    `
	Usage
	  $ river chat

	Options
	  --name  Your username

	Examples
	  $ river chat --name=Rushikesh
`,
    {
        importMeta: import.meta,
        flags: {
            name: {
                type: 'string',
            },
        },
    },
);

// clear(); // Clear screen for a fresh "app" feel
// Note: 'clear' might not be needed if Ink handles full screen mode well, but user asked for a "nice ui".
// Ink's 'render' usually appends. 'console-clear' ensures we start at the top.
clear();

// Check if user ran 'river chat' or just 'river'
// input[0] would be 'chat'
if (cli.input.length > 0 && cli.input[0] !== 'chat') {
    console.log(`Unknown command: ${cli.input[0]}`);
    cli.showHelp();
} else {
    // 'river' or 'river chat'
    render(<App />);
}
