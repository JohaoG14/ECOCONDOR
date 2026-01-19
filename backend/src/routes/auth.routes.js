const express = require('express');
const router = express.Router();
const { db, auth } = require('../config/firebase.config');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * POST /api/auth/register
 * Registrar un nuevo usuario en Firestore después del registro en Firebase Auth
 */
router.post('/register', async (req, res) => {
    try {
        const { uid, email, displayName } = req.body;

        if (!uid || !email) {
            return res.status(400).json({
                success: false,
                error: 'uid y email son requeridos'
            });
        }

        // Crear documento del usuario en Firestore
        const userDoc = {
            uid,
            email,
            displayName: displayName || email.split('@')[0],
            points: 0,
            totalRecycled: 0,
            createdAt: new Date().toISOString()
        };

        await db.collection('users').doc(uid).set(userDoc);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: userDoc
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            error: 'Error al registrar usuario'
        });
    }
});

/**
 * GET /api/auth/profile
 * Obtener perfil del usuario autenticado
 */
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const userDoc = await db.collection('users').doc(req.user.uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                error: 'Perfil no encontrado'
            });
        }

        res.json({
            success: true,
            data: userDoc.data()
        });
    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener perfil'
        });
    }
});

/**
 * PUT /api/auth/profile
 * Actualizar perfil del usuario
 */
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { displayName } = req.body;

        const updates = {};
        if (displayName) updates.displayName = displayName;
        updates.updatedAt = new Date().toISOString();

        await db.collection('users').doc(req.user.uid).update(updates);

        res.json({
            success: true,
            message: 'Perfil actualizado'
        });
    } catch (error) {
        console.error('Error actualizando perfil:', error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar perfil'
        });
    }
});

module.exports = router;
