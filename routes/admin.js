const path = require('path');

const express = require('express');
const session = require('express-session');

const adminController = require('../controllers/admin');

const router = express.Router();

//các đường link url và các controller tương ứng để điều khiển nó --xong -test ok

router.get('/admin-login', adminController.getAdminLogin);
//router.get('/ad-control', adminController.getEditAdminLogin);

//login --xong -test ok
router.post('/login', adminController.login);   //đg link giống với bên login.ejs. đây là link, khi ta nhập sai sẽ đi đến

//thêm code--xong --ok
router.post('/add-code', adminController.postCode);
//xóa tài khoản admin--xong --ok
router.post('/deletead', adminController.postDeleteadmin); 
//xóa tài khoản người chơi --xong --ok
router.post('/delete', adminController.postDelete); 
//đổi mật khẩu tài khoản --xong --ok
router.post('/fixadpass', adminController.postFixAdPass); 
//thêm admin mới--xong --ok
router.post('/add-admin', adminController.postAddAdmin); 
//xóa tài khoản khách hàng --xong --ok
router.post('/deletecus', adminController.postDeleteCus); 


//QUẢNG CÁO//
//sửa giá tiền quảng cáo --xong --test ok 
router.post('/fix-price', adminController.postFixAd);
//Cấp quyền quảng cáo cho người --xong
router.post('/authority', adminController.postFixAu);
//Xóa bỏ quyền người dùng --xong 
router.post('/revoke-id', adminController.postRvId);
//Xóa bỏ link quảng cáo người  --xong
router.post('/revoke-picture', adminController.postRvPic);
//Xóa bỏ link URL người dùng --xong
router.post('/revoke-url', adminController.postRvUrl);

//sau tất cả, luôn trở về controller, luôn để get này ở cuối cùng --xong --test ok
router.get('/admin-control', adminController.getControl);//main, link đến sau khi ta login thêm code hoặc thêm admin mới


exports.routes = router;    //phải có