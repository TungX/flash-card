const router = require('express').Router();
const controller = require('../../controllers/api/word');
router.get('/:id', controller.show);
router.get('/', controller.getAll);
router.post('/', controller.insert);
router.put('/', controller.update);
router.delete('/', controller.remove);
module.exports = router;