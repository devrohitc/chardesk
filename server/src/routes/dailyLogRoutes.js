const express = require('express');
const router = express.Router();
const dailyLogController = require('../controllers/dailyLogController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { updateDailyLogValidator } = require('../validators/dailyLogValidators');

router.use(authMiddleware);

router.get('/', dailyLogController.getAllLogs);
router.get('/:date', dailyLogController.getLog);
router.put('/:date', updateDailyLogValidator, validate, dailyLogController.updateLog);

module.exports = router;

