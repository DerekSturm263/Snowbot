import { appendFileSync } from 'fs';

const filePath = 'debug.txt';

export default function log(message) {
    console.log(message);
    appendFileSync(filePath, message, );
}

export function logError(message) {
    console.error(message);
    appendFileSync(filePath, message);
}

