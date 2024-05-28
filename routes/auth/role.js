import jwt from 'jsonwebtoken';
export default function isPoet(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing token.' });
    }

    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token.' });
        }

        if (decoded.role !== 'poet') {
            return res.status(403).json({ message: 'Forbidden: User is not a poet.' });
        }

        next();
    });
}

