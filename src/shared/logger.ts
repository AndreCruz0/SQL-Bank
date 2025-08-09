import winston from 'winston';
import { env } from './env';

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};

const isDevelopment = env.NODE_ENV === 'development';

const level = () => {
	return isDevelopment ? 'debug' : 'warn';
};

const colors = {
	error: 'red',
	warn: 'yellow',
	info: 'green',
	http: 'magenta',
	debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
	winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
	winston.format.colorize({ all: true }),
	winston.format.printf((info) => {
		const { timestamp, level, message, ...meta } = info;
		const metaString = Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : '';
		return `${timestamp} - ${level}: ${message}${metaString ? `\n${metaString}` : ''}`;
	}),
);

const transports: winston.transport[] = [new winston.transports.Console()];

if (isDevelopment) {
	transports.push(
		new winston.transports.File({
			filename: 'logs/error.log',
			level: 'error',
		}),
		new winston.transports.File({
			filename: 'logs/all.log',
		}),
	);
}

const Logger = winston.createLogger({
	level: level(),
	levels,
	format,
	transports,
});

export default Logger;
