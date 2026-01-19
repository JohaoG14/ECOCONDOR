const { auth } = require('../config/firebase.config');

/**
 * Middleware para verificar el token JWT de Firebase
 * Extrae el userId del token y lo añade a req.user
 */
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Token de autenticación no proporcionado'
            });
        }

        const token = authHeader.split('Bearer ')[1];

        // Verificar el token con Firebase
        const decodedToken = await auth.verifyIdToken(token);

        // Añadir información del usuario a la request
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified
        };

        next();
    } catch (error) {
        console.error('Error de autenticación:', error.message);

        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({
                success: false,
                error: 'Token expirado. Por favor, inicia sesión nuevamente.'
            });
        }

        return res.status(401).json({
            success: false,
            error: 'Token inválido'
        });
    }
};

module.exports = authMiddleware;
