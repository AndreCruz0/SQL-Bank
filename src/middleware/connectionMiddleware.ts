import type { NextFunction, Request, Response } from 'express';
import Logger from '../shared/logger';
import { handleError } from '../shared/error';
import {conn} from '../db/conn'


export async function connectionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    
    await conn.authenticate();
    Logger.info('Conexão com o banco de dados estabelecida.');

    next();
  } catch (err) {
    Logger.error('Erro ao conectar com o banco de dados:', err);
    handleError(res, err);
  }
}
