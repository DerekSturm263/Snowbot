import { appendFileSync } from 'fs';

const filePath = 'debug.txt';

export default function log(message) {
    console.log(message);
    appendFileSync(filePath, message + "\n");
}

export function logError(message) {
    console.error(message);
    appendFileSync(filePath, message + "\n");
}

