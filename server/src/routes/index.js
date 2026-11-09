const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const questRoutes = require('./questRoutes');
const dailyLogRoutes = require('./dailyLogRoutes');
const financeRoutes = require('./financeRoutes');
const trainerRoutes = require('./trainerRoutes');
const healthRoutes = require('./healthRoutes');

router.use('/auth', authRoutes);
router.use('/quests', questRoutes);
router.use('/logs', dailyLogRoutes);
router.use('/finance', financeRoutes);
router.use('/trainer', trainerRoutes);
router.use('/health', healthRoutes);

module.exports = router;
