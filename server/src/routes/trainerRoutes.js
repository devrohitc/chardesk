const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/progress', trainerController.getProgress);
router.post('/catch', trainerController.catchPokemon);
router.put('/partner', trainerController.setPartner);
router.post('/focus', trainerController.recordFocus);

module.exports = router;
