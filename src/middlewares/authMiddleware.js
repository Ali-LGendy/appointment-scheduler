import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JET_SECRET;

export default function authMiddleware(req, res, next) {
    try {
        const auth = req.headers.authorization;
        if(!auth) {    
            return res.status(401).json({ message: 'Missing Authorization header' });
        }
        const parts = auth.split(' ');
        if(parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ message: 'Invalid Authorization format' });
        }

        const token = parts[1];
        const payload = jwt.verify(token, ACCESS_SECRET);
        req.user = {
            id: payload.sub,
            role: payload.role
        }

        next();

    } catch(err) {
        console.error('Auth middleware error: ', err.message)
        return res.status(401).json({ message: 'Unauthorized' });
    }
}