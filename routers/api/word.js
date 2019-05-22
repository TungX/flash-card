const router = require('express').Router();
const controller = require('../../controllers/api/word');
router.get('/:id', controller.show);
router.get('/', controller.getAll);
module.exports = router;