import { writeFileSync } from 'fs';

const filePath = 'debug.txt';

export default function log(message) {
    console.log(message);
    writeFileSync(filePath, message);
}

export function logError(message) {
    console.logError(message);
    writeFileSync(filePath, message);
}

