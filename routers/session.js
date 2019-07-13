/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


const router = require('express').Router();
const controller = require('../controllers/session');
router.get('/', controller.show);
router.post('/', controller.login);
router.delete('/', controller.logout);
router.get('/logout', controller.logout);
module.exports = router;