/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


const router = require('express').Router();
const controller = require('../controllers/word');

router.get('/', controller.getAll);
router.post('/', controller.insert);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
module.exports = router;