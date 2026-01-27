import type { RequestHandler } from 'express';
import { hash, genSalt, compare } from 'bcrypt';
import { prisma } from '../db/prisma';
import jwt from 'jsonwebtoken';

export const register: RequestHandler<
  {},
  any,
  { name: string; email: string; password: string }
> = async (req, res) => {
  const { name, email, password: plainText } = req.body;

  const salt = await genSalt(12);
  const password = await hash(plainText, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });

  const token = jwt.sign({userId: user.id }, process.env.JWT_SECRET_KEY!);

  res.status(201).json({
    data: {
      name,
      email,
    },
    token
  });
};

export const login: RequestHandler<
  {},
  any,
  { email: string; password: string }
> = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({
      message: 'Invalid credentials.',
      code: 'UNAUTHORIZED',
    });
  }

  const passwordMatched = await compare(password, user.password);

  if (!passwordMatched) {
    return res.status(401).json({
      message: 'Invalid credentials.',
      code: 'UNAUTHORIZED',
    });
  }

  const token = jwt.sign({userId: user.id }, process.env.JWT_SECRET_KEY!);

  res.json({
    data: {
      name: user.name,
      email: user.email,
    },
    token
  });
};
