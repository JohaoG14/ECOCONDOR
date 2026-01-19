const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase.config');
const authMiddleware = require('../middleware/authMiddleware');

// Puntos por tipo de material (por kg o unidad)
const POINTS_PER_MATERIAL = {
    plastico: 10,
    vidrio: 8,
    papel: 5,
    metal: 15,
    organico: 3,
    electronico: 25
};

/**
 * POST /api/recycling/register
 * Registrar una nueva actividad de reciclaje
 */
router.post('/register', authMiddleware, async (req, res) => {
    try {
        const { material, quantity, unit, location } = req.body;

        if (!material || !quantity) {
            return res.status(400).json({
                success: false,
                error: 'material y quantity son requeridos'
            });
        }

        // Calcular puntos ganados
        const pointsPerUnit = POINTS_PER_MATERIAL[material.toLowerCase()] || 5;
        const pointsEarned = Math.round(quantity * pointsPerUnit);

        // Crear registro de actividad
        const activity = {
            userId: req.user.uid,
            material: material.toLowerCase(),
            quantity: parseFloat(quantity),
            unit: unit || 'kg',
            pointsEarned,
            location: location || null,
            createdAt: new Date().toISOString()
        };

        // Guardar actividad
        const activityRef = await db.collection('recycling_activities').add(activity);

        // Actualizar puntos del usuario
        const userRef = db.collection('users').doc(req.user.uid);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            const userData = userDoc.data();
            await userRef.update({
                points: (userData.points || 0) + pointsEarned,
                totalRecycled: (userData.totalRecycled || 0) + 1
            });
        }

        res.status(201).json({
            success: true,
            message: `¡Reciclaje registrado! Ganaste ${pointsEarned} puntos`,
            data: {
                id: activityRef.id,
                ...activity
            }
        });
    } catch (error) {
        console.error('Error registrando reciclaje:', error);
        res.status(500).json({
            success: false,
            error: 'Error al registrar reciclaje'
        });
    }
});

/**
 * GET /api/recycling/history
 * Obtener historial de reciclaje del usuario
 */
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;

        const snapshot = await db.collection('recycling_activities')
            .where('userId', '==', req.user.uid)
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();

        const history = [];
        snapshot.forEach(doc => {
            history.push({ id: doc.id, ...doc.data() });
        });

        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error('Error obteniendo historial:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener historial'
        });
    }
});

/**
 * GET /api/recycling/stats
 * Obtener estadísticas de reciclaje del usuario
 */
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const snapshot = await db.collection('recycling_activities')
            .where('userId', '==', req.user.uid)
            .get();

        const stats = {
            totalActivities: 0,
            totalPoints: 0,
            byMaterial: {}
        };

        snapshot.forEach(doc => {
            const data = doc.data();
            stats.totalActivities++;
            stats.totalPoints += data.pointsEarned || 0;

            if (!stats.byMaterial[data.material]) {
                stats.byMaterial[data.material] = { count: 0, quantity: 0 };
            }
            stats.byMaterial[data.material].count++;
            stats.byMaterial[data.material].quantity += data.quantity || 0;
        });

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener estadísticas'
        });
    }
});

module.exports = router;
