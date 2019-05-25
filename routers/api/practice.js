const router = require('express').Router();
const controller = require('../../controllers/api/practice');

router.put('/:id', controller.update);
router.get('/build-questions', controller.buildQuestions);
module.exports = router;