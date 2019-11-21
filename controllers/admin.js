const express = require('express');
const session = require('express-session');
const router = express();
const conn = require('../util/database');
const sequelize = require('../util/db-sequelize');  //sử dụng database
const Code = require('../models/code');
const Admin = require('../models/user');

router.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

exports.getAdminLogin = (req, res, next) => {
    res.render('login', {
        pageTitle: 'Admin Login',
        path: '/admin-login'
    });
};

//login
 exports.login = function(request, response){
   var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		conn.query('SELECT * FROM admins WHERE name = ? AND pass = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				//request.session.loggedinadmin = true;    //lưu dữ liệu đã được login vào trong này
				request.session.admin = username; //session for admin
				response.redirect('/admin-control'); //đúng thì trả về home
			} else {
				response.send('Incorrect Username and/or Password!');   //ko đúng thì trả về đường dẫn /login. Như bên file html
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
 };
//admin controller
//đi đến trang control
exports.getControl = function(request, response, next){
  //hiển thị danh sách tất cả mã code
    conn.query("SELECT * FROM codes", function (err, result, fields) {
      conn.query("SELECT * FROM users", function (err, player, fields){
        conn.query("SELECT * FROM customers", function (err, cus, fields){
        conn.query("SELECT * FROM catalogs", function (err, catalog, fields){
        conn.query("SELECT * FROM admins WHERE name = ?",[request.session.admin], function (err, admins, fields){

          //thay vì phải dùng session để xét, ta có thể dùng cách này, đơn giản hơn nhiều. 
          if (!err) {
          response.render('admin-control', {
          adminname: admins[0],
          fields: result,
          players: player,
          customer: catalog,
          cus: cus,
          path: '/admin-control'
           });  
        }
          else {
            response.send('Please login to view this page!');
          }
          response.end();
        });
      });
    });
  });
  });
  };


     
  //hiển thị danh sách tất cả khách hàng 
 
//thêm code
exports.postCode = function(req, res, next){
      //hàm khởi tạo
      const code = req.body.code;
      const coin = req.body.coin;
      var sql = "INSERT INTO codes (code, coin, used) VALUES (?, ?, ?)";
      conn.query(sql,[code, coin, 0], function (err, result) {
        if (err) {
          return res.send('This code is already used'); 
        };
        res.redirect('/admin-control');
        res.end();
        console.log("1 record inserted");
      });
};
//thêm admin
exports.postAddAdmin = function(request, response, next){
	var name = request.body.name;
	var pass = request.body.pass;
	if (name && pass) {
		conn.query('INSERT INTO admins (name, pass) VALUES(?, ?) ', [name, pass], function(error, results, fields) {
			if (!error) {
				response.redirect('/admin-control'); 
			} else {
				response.send('This username is already exist');  
			}			
			response.end();
		});
	} else {
		response.send('Please enter Admin Username!');
		response.end();
	}
};
//xóa admin
exports.postDeleteadmin = function(request, response, next){
  conn.query('DELETE FROM admins WHERE name = ?', [request.session.admin], function(error, results, fields) {
    if (!error) {
      response.redirect('/admin-control'); 
    } else {
      response.send('Something error!');  
    }			
    response.end();
  });
};
//xóa người chơi
exports.postDelete = function(request, response, next){
	var userplayer = request.body.userplayer;
	if (userplayer) {
		conn.query('DELETE FROM users WHERE name = ? ', [userplayer], function(error, results, fields) {
			if (!error) {
				response.redirect('/admin-control'); 
			} else {
				response.send('Something error!');  
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username!');
		response.end();
	}
};

//xóa khách hàng
exports.postDeleteCus = function(request, response, next){
	var userCustomer = request.body.userCustomer;
	if (userCustomer) {
		conn.query('DELETE FROM customers WHERE name = ? ', [userCustomer], function(error, results, fields) {
			if (!error) {
				response.redirect('/admin-control'); 
			} else {
				response.send('Something error!');  
			}			
			response.end();
		});
	} else {
		response.send('Please enter Customer name!');
		response.end();
	}
};

//đổi mật khẩu tài khoản
exports.postFixAdPass = function(request, response, next){
  var oldpass = request.body.oldpass;
  var newpass = request.body.newpass;
  var cfnewpass = request.body.cfnewpass;

  if(oldpass && newpass && cfnewpass) {
    if(oldpass == newpass){
      response.send('Do not use your old password for the new one');
    }
    else if(cfnewpass != newpass){
      response.send('Your new password and confirm password are not match');
    }
    else{
		conn.query('UPDATE ec.admins SET pass = ? WHERE name=?', [newpass, request.session.admin], function(error, results, fields) {
        if (!error) {
					response.redirect('/admin-control'); 
					response.end();
        } else {
					response.send('Something error!');  
					response.end();
        }
      });
    }
	} else {
		response.send('Please enter all fields !!!');
		response.end();
		
  }

  
};
//sửa giá tiền quảng cáo
exports.postFixAd = function(request, response, next){
  var pos = request.body.pos;
  var price = request.body.price;
	if (pos && price) {
		conn.query('UPDATE ec.catalogs SET price = ? WHERE pos= ?', [price, pos], function(error, results, fields) {
			if (!error) {
				response.redirect('/admin-control'); 
			} else {
				response.send('Something error!');  
			}			
			response.end();
		});
	} else {
		response.send('Your position ad may not available or price must be a number');
		response.end();
	}
};
//Cấp quyền quảng cáo cho khách hàng
exports.postFixAu = function(request, response, next){
  var pos = request.body.pos;
  var customer_id = request.body.customer_id;
	if (pos && customer_id) {
      //tìm xem có người dùng đó hay không
      conn.query('SELECT * FROM ec.customers WHERE name=?', [customer_id], function(error, cus, fields) {
        if(cus.length >0){
					conn.query('UPDATE ec.catalogs SET view = 0 WHERE pos= ?', [pos], function(error, resultss, fields) {});
          conn.query('UPDATE ec.catalogs SET customer_id = ? WHERE pos= ?', [customer_id, pos], function(error, results, fields) {
            if (!error) {
							response.redirect('/admin-control'); 
							response.end();
            } else {
							response.send('Something error!');  
							response.end();
            }			
            
          });
        }
        else{
					response.send('This customer id is not available');
					response.end();
        }
      });
	} else {
		response.send('Please enter all field');
		response.end();
		
  }
  
};
//Xóa bỏ quyền người dùng
//nghĩa là cũng xóa bỏ cả ngày bắt đầu và ngày kết thúc
exports.postRvId = function(request, response, next){
	var pos = request.body.pos;
	if (pos) {
		conn.query('UPDATE ec.catalogs SET customer_id = "", start_day=null, end_day=null WHERE pos= ?', [pos], function(error, results, fields) {
			if (!error) {
				response.redirect('/admin-control'); 
				response.end();
			} else {
				response.send('Something error!');  
				response.end();
			}
		});
	} else {
		response.send('Please enter Customer name!');
		response.end();
	}
};
//Xóa bỏ link quảng cáo người dùng
exports.postRvPic = function(request, response, next){
	var pos = request.body.pos;
	if (pos) {
		conn.query('UPDATE ec.catalogs SET pic = null WHERE pos= ?', [pos], function(error, results, fields) {
			if (!error) {
				response.redirect('/admin-control'); 
				response.end();
			} else {
				response.send('Something error!');  
				response.end();
			}
		});
	} else {
		response.send('Please enter Customer name!');
		response.end();
	}
};
//Xóa bỏ link URL người dùng
exports.postRvUrl = function(request, response, next){
	var pos = request.body.pos;
	if (pos) {
		conn.query('UPDATE ec.catalogs SET url = "" WHERE pos= ?', [pos], function(error, results, fields) {
			if (!error) {
				response.redirect('/admin-control'); 
				response.end();
			} else {
				response.send('Something error!');  
				response.end();
			}
		});
	} else {
		response.send('Please enter Customer name!');
		response.end();
	}
};

//res.render là cái ejs, đường dẫn đến file đó, trong folder views
// path: là đường dẫn trên browser, path bên này và bên route phải giống  nhau