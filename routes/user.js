const path = require('path');

const express = require('express'); //framework

const userController = require('../controllers/user');

const router = express.Router();

//trả về home mỗi khi mở lên
router.get('/', userController.getHome);
//các đường link url và các controller tương ứng để điều khiển nó


router.get('/user-register', userController.getUserRegister);
//register
router.post('/register-form', userController.postRegister);
router.get('/user-login', userController.getUserLogin);
//login
router.post('/login-user', userController.postLogin);
//add code
router.post('/add-player-code', userController.postAddCode);
///////////////////////////////////////////////////////////
//thay đổi password 
router.post('/fixuserpass', userController.postFixUserPass); 
//game
router.get('/game', userController.getGame);
//pokemon
router.post('/stop', userController.postStop)
router.post('/poke1', userController.poke1)
router.post('/poke2', userController.poke2)
router.post('/poke3', userController.poke3)
router.post('/poke4', userController.poke4)
router.post('/poke5', userController.poke5)
router.post('/poke6', userController.poke6)
router.post('/poke7', userController.poke7)
router.post('/poke8', userController.poke8)
router.post('/poke9', userController.poke9)
router.post('/poke10', userController.poke10)
router.post('/poke11', userController.poke11)
router.post('/poke12', userController.poke12)
//buy pokemon
router.post('/pk6', userController.pk6)
router.post('/pk8', userController.pk8)
//buy ball
router.post('/ball', userController.ball)

//12 quảng cáo



exports.routes = router;    //phải có