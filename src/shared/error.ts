import type { Response } from 'express';
import { ZodError } from 'zod';
import Logger from './logger';

export class ApiError extends Error {
	statusCode: number;
	constructor(message: string, statusCode = 400) {
		super(message);
		this.statusCode = statusCode;
		this.name = 'ApiError';
	}
}

export function handleError(res: Response, error: unknown) {
	if (error instanceof ApiError) {
		Logger.warn(`ApiError: ${error.message}`);
		return res.status(error.statusCode).json({ message: error.message });
	}

	if (error instanceof ZodError) {
		const issues = error.flatten((issue) => ({
			path: issue.path.join('.'),
			message: issue.message,
		}));
		Logger.warn('Erro de validação', { issues });
		return res.status(422).json({
			message: 'Erro de validação',
			issues,
		});
	}

	Logger.error('Erro inesperado:', error);
	return res.status(500).json({ message: 'Erro interno do servidor' });
}
