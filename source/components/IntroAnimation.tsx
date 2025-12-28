import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { createRequire } from 'module';
// @ts-ignore
import gifFrames from 'gif-frames';

const require = createRequire(import.meta.url);
const JimpPkg = require('jimp');
const Jimp = JimpPkg.default || JimpPkg;

interface IntroAnimationProps {
    filePath: string;
    onComplete: () => void;
    width?: number;
    height?: number;
}

type Pixel = { r: number; g: number; b: number; a: number };
type Frame = {
    chars: string[][];
    colors: string[][];
};

const streamToBuffer = (stream: any): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const chunks: any[] = [];
        stream.on('data', (chunk: any) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', (err: any) => reject(err));
    });
};

export const IntroAnimation = ({ filePath, onComplete, width = 60, height = 25 }: IntroAnimationProps) => {
    const [frames, setFrames] = useState<Frame[]>([]);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const targetWidth = width * 2;
    const targetHeight = height * 4;

    useEffect(() => {
        const loadGif = async () => {
            try {
                const frameData = await gifFrames({ url: filePath, frames: 'all', outputType: 'png', cumulative: true });

                const parsedFrames: Frame[] = [];

                for (const frame of frameData) {
                    const stream = frame.getImage();
                    const buffer = await streamToBuffer(stream);

                    const image = await Jimp.read(buffer);
                    // Resize to 2xWidth, 4xHeight
                    image.resize(targetWidth, targetHeight);

                    const charRows: string[][] = [];
                    const colorRows: string[][] = [];

                    for (let y = 0; y < height; y++) {
                        const rowChars: string[] = [];
                        const rowColors: string[] = [];

                        for (let x = 0; x < width; x++) {
                            // Analyze 2x4 block for this cell
                            let mask = 0;
                            let rSum = 0, gSum = 0, bSum = 0, count = 0;

                            // Braille dot mapping
                            // (0,0)->1   (1,0)->8
                            // (0,1)->2   (1,1)->16 (0x10)
                            // (0,2)->4   (1,2)->32 (0x20)
                            // (0,3)->64  (1,3)->128 (0x80) -> Dots 7,8 are special mapping in Unicode
                            // Correct Standard:
                            // 1 (0x1)  4 (0x8)
                            // 2 (0x2)  5 (0x10)
                            // 3 (0x4)  6 (0x20)
                            // 7 (0x40) 8 (0x80)

                            const map = [
                                { dx: 0, dy: 0, val: 0x1 },
                                { dx: 0, dy: 1, val: 0x2 },
                                { dx: 0, dy: 2, val: 0x4 },
                                { dx: 1, dy: 0, val: 0x8 },
                                { dx: 1, dy: 1, val: 0x10 },
                                { dx: 1, dy: 2, val: 0x20 },
                                { dx: 0, dy: 3, val: 0x40 },
                                { dx: 1, dy: 3, val: 0x80 },
                            ];

                            for (const dot of map) {
                                const px = x * 2 + dot.dx;
                                const py = y * 4 + dot.dy;

                                // Boundary check (should be safe due to resize, but careful)
                                const colorInt = image.getPixelColor(px, py);
                                const { r, g, b } = Jimp.intToRGBA(colorInt);
                                const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

                                if (lum > 80) { // Threshold for "ON"
                                    mask |= dot.val;
                                    rSum += r; gSum += g; bSum += b;
                                    count++;
                                }
                            }

                            // Generate Braille Char
                            const char = String.fromCharCode(0x2800 + mask);
                            rowChars.push(char);

                            // Calculate average color of lit pixels
                            if (count > 0) {
                                rowColors.push(`rgb(${Math.round(rSum / count)},${Math.round(gSum / count)},${Math.round(bSum / count)})`);
                            } else {
                                rowColors.push(''); // No color needed for empty space (or default)
                            }
                        }
                        charRows.push(rowChars);
                        colorRows.push(rowColors);
                    }
                    parsedFrames.push({ chars: charRows, colors: colorRows });
                }
                setFrames(parsedFrames);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
                setTimeout(onComplete, 3000);
            }
        };
        loadGif();
    }, [filePath, width, height, targetWidth, targetHeight, onComplete]);

    useEffect(() => {
        if (frames.length === 0) return;

        const interval = setInterval(() => {
            setCurrentFrame((prev) => {
                if (prev >= frames.length - 1) {
                    clearInterval(interval);
                    setTimeout(onComplete, 500);
                    return prev;
                }
                return prev + 1;
            });
        }, 80);

        return () => clearInterval(interval);
    }, [frames, onComplete]);

    if (loading) return <Box><Text color="red">[ ESTABLISHING_ONION_ROUTE_TO_RIVER... ]</Text></Box>;
    if (error) return <Box><Text color="red">FATAL_ERROR: {error}</Text></Box>;
    if (frames.length === 0) return null;

    const { chars, colors } = frames[currentFrame];

    return (
        <Box flexDirection="column" alignItems="center" justifyContent="center">
            {chars.map((row, y) => (
                <Box key={y} flexDirection="row">
                    {row.map((char, x) => (
                        <Text
                            key={x}
                            color={colors[y][x] || 'black'}
                        >
                            {char}
                        </Text>
                    ))}
                </Box>
            ))}
            <Box marginTop={1}>
                <Text color="#39ff14">[ TOR_CIRCUIT_ACTIVE :: RIVER_UPLINK_SECURE ]</Text>
            </Box>
        </Box>
    );
};
