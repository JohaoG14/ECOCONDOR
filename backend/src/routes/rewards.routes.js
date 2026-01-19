const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase.config');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * GET /api/rewards
 * Listar todas las recompensas disponibles
 */
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('rewards')
            .where('available', '==', true)
            .orderBy('pointsCost', 'asc')
            .get();

        const rewards = [];
        snapshot.forEach(doc => {
            rewards.push({ id: doc.id, ...doc.data() });
        });

        res.json({
            success: true,
            data: rewards
        });
    } catch (error) {
        console.error('Error obteniendo recompensas:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener recompensas'
        });
    }
});

/**
 * GET /api/rewards/points
 * Obtener puntos actuales del usuario
 */
router.get('/points', authMiddleware, async (req, res) => {
    try {
        const userDoc = await db.collection('users').doc(req.user.uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        const userData = userDoc.data();

        res.json({
            success: true,
            data: {
                points: userData.points || 0,
                totalRecycled: userData.totalRecycled || 0
            }
        });
    } catch (error) {
        console.error('Error obteniendo puntos:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener puntos'
        });
    }
});

/**
 * POST /api/rewards/redeem
 * Canjear puntos por una recompensa
 */
router.post('/redeem', authMiddleware, async (req, res) => {
    try {
        const { rewardId } = req.body;

        if (!rewardId) {
            return res.status(400).json({
                success: false,
                error: 'rewardId es requerido'
            });
        }

        // Obtener recompensa
        const rewardDoc = await db.collection('rewards').doc(rewardId).get();

        if (!rewardDoc.exists) {
            return res.status(404).json({
                success: false,
                error: 'Recompensa no encontrada'
            });
        }

        const reward = rewardDoc.data();

        // Verificar puntos del usuario
        const userRef = db.collection('users').doc(req.user.uid);
        const userDoc = await userRef.get();
        const userData = userDoc.data();

        if ((userData.points || 0) < reward.pointsCost) {
            return res.status(400).json({
                success: false,
                error: `Puntos insuficientes. Necesitas ${reward.pointsCost} puntos.`
            });
        }

        // Descontar puntos y registrar canje
        await userRef.update({
            points: userData.points - reward.pointsCost
        });

        // Crear registro de canje
        const redemption = {
            userId: req.user.uid,
            rewardId,
            rewardName: reward.name,
            pointsSpent: reward.pointsCost,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        const redemptionRef = await db.collection('redemptions').add(redemption);

        res.status(201).json({
            success: true,
            message: `¡Canjeaste "${reward.name}" exitosamente!`,
            data: {
                id: redemptionRef.id,
                ...redemption,
                remainingPoints: userData.points - reward.pointsCost
            }
        });
    } catch (error) {
        console.error('Error canjeando recompensa:', error);
        res.status(500).json({
            success: false,
            error: 'Error al canjear recompensa'
        });
    }
});

/**
 * GET /api/rewards/my-redemptions
 * Obtener historial de canjes del usuario
 */
router.get('/my-redemptions', authMiddleware, async (req, res) => {
    try {
        const snapshot = await db.collection('redemptions')
            .where('userId', '==', req.user.uid)
            .orderBy('createdAt', 'desc')
            .get();

        const redemptions = [];
        snapshot.forEach(doc => {
            redemptions.push({ id: doc.id, ...doc.data() });
        });

        res.json({
            success: true,
            data: redemptions
        });
    } catch (error) {
        console.error('Error obteniendo canjes:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener canjes'
        });
    }
});

module.exports = router;
