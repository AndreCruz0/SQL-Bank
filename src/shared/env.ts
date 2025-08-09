import dotenv from 'dotenv';
import { z } from 'zod';

const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
dotenv.config({ path: envFile });

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'test']),
	DATABASE_URL: z.url()
	
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error('❌ Erro ao validar variáveis de ambiente:\n', parsed.error.format());
	process.exit(1);
}

export const env = parsed.data;
