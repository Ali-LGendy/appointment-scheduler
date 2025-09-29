import db from "../db/knex.js"
import * as usersModel from "../models/usersModel.js"
import * as tokensModel from "../models/refreshTokensModel.js"

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import ms from 'ms'

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXP = process.env.JWT_EXPIRY;
const REFRESH_EXP = process.env.JWT_REFRESH_EXPIRY;
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const expiryToMs = (s) => {
  const n = parseInt(s.slice(0, -1), 10);
  const u = s.slice(-1);
  if (u === 's') return n * 1000;
  if (u === 'm') return n * 60 * 1000;
  if (u === 'h') return n * 60 * 60 * 1000;
  if (u === 'd') return n * 24 * 60 * 60 * 1000;
  return parseInt(s, 10) * 1000;
};

const signAccess = (user) => {
  return jwt.sign(
    { sub: user.id, email: user.email },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXP }
  );
}

const signRefresh = (user) => {
  return jwt.sign(
    { sub: user.id, email: user.email },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXP }
  );
}

export async function register({email, password, name, role = 'user', service_type = null}) {
    const existing = await usersModel.getUserByEmail(email);
    if(existing) {
        const err = new Error('Email already registered');
        err.status = 409;
        throw err;
    }

    const password_hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const user = await usersModel.createUser({
        email,
        password_hash,
        name,
        role,
        service_type
    });

    return { user };
}

export async function login({email, password}) {
    const user = await usersModel.getUserByEmail(email);
    if(!user) {
        const err = new Error('Invalid email or password');
        err.status = 401;
        throw err;
    }

    const match = await bcrypt.compare(password, user.password_hashpassword_hash);
    if(!match) {
        const err = new Error('Invalid email or password');
        err.status = 401;
        throw err;
    }

    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user);
    const tokenHash  = hashToken(refreshToken);
    const expires_at = new Date(Date.now() + expiryToMs(REFRESH_EXP));

    await tokensModel.insertToken({ user_id: user.id, token_hash: tokenHash, expires_at });

    return { user: {id: user.id, email: user.email, name: user.name, role: user.role } ,accessToken, refreshToken };
}