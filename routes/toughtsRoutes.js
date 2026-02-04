const express = require('express');
const router = express.Router();
const ToughtsController = require('../controllers/ToughtsController');

//helper
const { checkAuth } = require('../helpers/auth');

router.get('/add', checkAuth, ToughtsController.addTought);
router.post('/add', checkAuth, ToughtsController.addToughtSave);

router.get('/dashboard', checkAuth, ToughtsController.dashboard);
router.post('/remove', checkAuth, ToughtsController.removeTought);

router.get('/', ToughtsController.showToughts);

module.exports = router;