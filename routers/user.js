/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const router = require('express').Router();
const controller = require('../controllers/user');
router.get('/add', controller.add);
router.post('/', controller.insert);
module.exports = router;

