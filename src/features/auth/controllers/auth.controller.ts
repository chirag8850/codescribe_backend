import type { Request, Response } from 'express';

export const signup = (_req: Request, res: Response): void => {
    res.json({ message: 'Hello from signup!' });
};

export const login = (_req: Request, res: Response): void => {
    res.json({ message: 'Hello from login!' });
};
