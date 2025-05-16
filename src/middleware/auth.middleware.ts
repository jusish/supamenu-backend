import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import User from '../models/factory/user'
import logger from '../common/logger'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
}

interface AuthRequest extends Request {
    user?: User
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')
    if (!token) {
        return res.status(401).send('Access denied. No token provided.')
    }
    try {
        logger.info(token)
        const decoded = jwt.verify(token.split('Bearer ')[1], JWT_SECRET) as { id: string, iat: number, exp: number}
        const user = await User.findByPk(decoded.id)
        logger.info(user)
        if (!user) {
            return res.status(401).send('User not found')
        }
        req.user = user
        next()
    } catch (error:any) {
        res.status(400).send('Invalid token' + error.message)
    }
}
export { authMiddleware }