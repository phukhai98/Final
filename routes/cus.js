const path = require('path');

const express = require('express'); //framework

const cusController = require('../controllers/cus');

const router = express.Router();

//đăng ký quảng cáo --test ok
router.get('/cus-reg', cusController.getADreg);
router.post('/reg-ad', cusController.postAdReg);
router.get('/cus', cusController.getAD);
//login
router.post('/login-ad', cusController.postAdLogin);
//đặt cọc quảng cáo
//router.post('/buy-ad', cusController.postAdLogin);
//thay đổi mật khẩu

//xem link của vị trí quảng cáo xài cho cả bên admin và cus --xong
router.post('/watchad', cusController.postWatchad); //chỉ cho admin
router.post('/watchad2', cusController.postWatchad2);//cho customer
router.get('/link', cusController.getWatch);//cho admin, chứ ko cho customer
//trả về trang xem url and picture cho customer
router.get('/link2', cusController.getWatch2);
//thêm link của quảng cáo
router.post('/addlink', cusController.postaddlink);
//thêm url hình ảnh của quảng cáo
router.post('/addurlpic', cusController.postaddurlpic);

//thay đổi password
router.post('/fixadpass', cusController.postFixCusPass); 
//về trang chủ --xong
router.get('/cus-control', cusController.getAdControl);

//12 trang quảng cáo POST
router.post('/1', cusController.ad1);
router.post('/2', cusController.ad2);
router.post('/3', cusController.ad3);
router.post('/4', cusController.ad4);
router.post('/5', cusController.ad5);
router.post('/6', cusController.ad6);
router.post('/7', cusController.ad7);
router.post('/8', cusController.ad8);
router.post('/9', cusController.ad9);
router.post('/10', cusController.ad10);
router.post('/11', cusController.ad11);
router.post('/12', cusController.ad12);



exports.routes = router;    //phải có