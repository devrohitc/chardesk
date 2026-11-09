const express = require('express');
const router = express.Router();
const questController = require('../controllers/questController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { createQuestValidator } = require('../validators/questValidators');

router.use(authMiddleware);

router.get('/', questController.getQuests);
router.post('/', createQuestValidator, validate, questController.createQuest);
router.put('/:id/toggle', questController.toggleQuest);
router.delete('/:id', questController.deleteQuest);

module.exports = router;
