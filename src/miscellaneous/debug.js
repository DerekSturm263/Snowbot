import { appendFileSync } from 'fs';

// import { winston} from 'winston'; 
// import { LoggingWinston } from '@google-cloud/logging-winston';

const filePath = 'debug.txt';

// const loggingWinston = new LoggingWinston();
// const logger = winston.createLogger({
//     level: 'info',
//     transports: [
//         new winston.tansports.Console(),
//         loggingWinston
//     ]
// });

export default function log(message) {
    console.log(message);
    //logger.info(message);
    appendFileSync(filePath, message + "\n");
}

export function logError(message) {
    console.error(message);
    //logger.error(message);
    appendFileSync(filePath, message + "\n");
}
