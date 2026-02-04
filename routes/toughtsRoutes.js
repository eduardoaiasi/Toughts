const express = require('express');
const router = express.Router();
const ToughtsController = require('../controllers/ToughtsController');

//helper
const { checkAuth } = require('../helpers/auth');

//Adiconar toughts
router.get('/add', checkAuth, ToughtsController.addTought);
router.post('/add', checkAuth, ToughtsController.addToughtSave);

// Editar toughts
router.get('/edit/:id', checkAuth, ToughtsController.editTought);
router.post('/edit/:id', checkAuth, ToughtsController.editToughtSave);

//Dashboard exibe toughts do usuario
router.get('/dashboard', checkAuth, ToughtsController.dashboard);

//Remover toughts
router.post('/remove', checkAuth, ToughtsController.removeTought);

router.get('/', ToughtsController.showToughts);

module.exports = router;