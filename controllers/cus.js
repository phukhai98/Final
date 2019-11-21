const express = require('express');
const router = express();
const conn = require('../util/database');
const sequelize = require('../util/db-sequelize');  //sử dụng database
const User = require('../models/user');
const cookieSession = require('cookie-session')
const cookieParser  = require('cookie-parser')


//quảng cáo
//đăng ký tài khoản quảng cáo (get)
exports.getADreg= (request, response, next) => {
    response.render('ad-register', {
      pageTitle: 'Customer reg',
      path: '/cus-reg'
   });
  };
  //đăng ký tài khoản quảng cáo (post)
  exports.postAdReg = function(req, res, next){
    //hàm khởi tạo
    const name = req.body.name;
    const pass = req.body.pass;
    var sql = "INSERT INTO customers (name, pass) VALUES (?, ?)";
    conn.query(sql,[name, pass], function (err, result) {
      if (err) {
        return res.send('This accout is already used'); 
      };
      res.redirect('/cus');
      res.end();
    });
};

  //đăng nhập quảng cáo (get)
exports.getAD= (request, response, next) => {
    response.render('ad-login', {
      pageTitle: 'Customer Login',
      path: '/cus'
   });
  };
  //đăng nhập quảng cáo (post)
  exports.postAdLogin= (request, response, next) => {
    var username = request.body.username;
    var password = request.body.password;
    
    if (username && password) //nếu trong thanh tìm kiếm có dữ liệu, thì truy vấn
    {
          conn.query('SELECT * FROM customers WHERE name = ? AND pass = ?', [username, password], function(error, results, fields) {
        if (!error) {
          //session
          //request.session.loggedin = true;    //lưu dữ liệu đã được login vào trong này
          request.session.adname = username;  //lưu session của khách hàng
          response.redirect('/cus-control'); //đúng thì trả về home
          
              } else {
                  response.send('Incorrect Username and/or Password!');   //ko đúng thì trả về đường dẫn /login. Như trên file html
              }			
              response.end();
          });
      } else {
          response.send('Please enter Username and Password!');
          response.end();
      }
  };
  //vể trang điều khiển cho khách quảng cáo
  exports.getAdControl= (request, response, next) => {
     conn.query("SELECT * FROM ec.catalogs WHERE customer_id=?", [request.session.adname], function(error, controlad, fields) {
      conn.query("SELECT * FROM ec.catalogs" , function(error, ecatalog, fields) {
      conn.query("SELECT * FROM ec.customers WHERE name=?" ,[request.session.adname], function(errors, cus, fields) {
      //conn.query('SELECT * FROM catalogs WHERE customer_id = ? ',[request.session.adname],  function(error, ad, fields) {
      if (!errors) {
      response.render('ad-controller', {
      ecatalog: ecatalog, //hiển thị ecatalog
      cus: cus[0], //hiển thị tên người dùng
      //hiển thị quảng cáo người dùng đã mua
      customer:controlad,
      path: '/cus-control'
      });
     } else {
    response.send('Please login to view this page!');
    response.end();
    }
   
    });
  });
    });
  };
  //xem link của quảng cáo (post)
  exports.postWatchad= (request, response, next) => {
    var pos = request.body.cusid;

    if (pos) //nếu trong thanh tìm kiếm có dữ liệu, thì truy vấn
    {
      //nếu không có đăng ký thì ko đc xem
          conn.query('SELECT * FROM catalogs WHERE pos = ?', [pos], function(error, results, fields) {
            if (results.length >0) {
              request.session.pos = pos
              response.redirect('/link');
              response.end();
            } else {
                response.send('This position are not available');   //ko đúng thì trả về đường dẫn /login. Như trên file html
                response.end();
            }

          });
      
    } else {
          response.send('Please enter Position');
          response.end();
      }
  };

    //xem link của quảng cáo (get)
    exports.getWatch= (request, response, next) => {
      conn.query('SELECT * FROM catalogs WHERE pos = ?', [request.session.pos], function(error, results, fields) {
        if (results.length >0) {
          response.render('UrlAndPic', {
            cus: results[0],
            path: '/link'
          });
        }

      });

    };

    //thêm link vào quảng cáo
    exports.postaddlink = function(request, response, next){
      var link = request.body.linkurl;
      if (link) {
        conn.query('UPDATE ec.catalogs SET url = ? WHERE pos= ? ', [link, request.session.pos], function(error, results, fields) {
          if (!error) {
            response.redirect('/cus-control'); 
            response.end();
          } else {
            response.send('You do not buy this advertisment');
            response.end();
          }
        });
      } else {
        response.send('Please enter Link');
        response.end();
      }
    };
    //thêm URL Picture vào quảng cáo
    exports.postaddurlpic = function(request, response, next){
      var pic = request.body.urlpic;
      if (pic) {
        conn.query('UPDATE ec.catalogs SET pic = ? WHERE pos= ?', [pic, request.session.pos], function(error, results, fields) {
          if (!error) {
            response.redirect('/cus-control'); 
            response.end();
          } else {
            response.send('You do not buy this advertisment');
            response.end();
          }
        });
      } else {
        response.send('Please enter picture URL');
        response.end();
      }
    };
    //xem url và picture
    exports.postWatchad2= (request, response, next) => {
      var pos = request.body.cusid;
  
      if (pos) //nếu trong thanh tìm kiếm có dữ liệu, thì truy vấn
      {
        //nếu không có đăng ký thì ko đc xem
            conn.query('SELECT * FROM catalogs WHERE pos = ?', [pos], function(error, results, fields) {
              if (results.length >0) {
                request.session.pos = pos
                response.redirect('/link2');
                response.end();
              } else {
                  response.send('This position are not available');   //ko đúng thì trả về đường dẫn /login. Như trên file html
                  response.end();
              }
  
            });
        
      } else {
            response.send('Please enter Position');
            response.end();
        }
    };
    //trả về trang xem link url và picture
    exports.getWatch2= (request, response, next) => {
      conn.query('SELECT * FROM catalogs WHERE pos = ?', [request.session.pos], function(error, results, fields) {
        if (results.length >0) {
          response.render('addUrlandPic', {
            cus: results[0],
            path: '/link2'
          });
        }

      });

    };

    //12 link quảng cáo- để tăng lượt click
    exports.ad1= (request, response, next) => {
      conn.query('SELECT * FROM catalogs WHERE pos = 1', function(error, clicks, fields) {
        let click=clicks[0].click;
        let url=clicks[0].url; //chuyển về trang web quảng cáo
        if(url !=null ){
        click=click+1;  //tăng số lần click
        conn.query('UPDATE ec.catalogs SET click=? WHERE pos=1', [click], function(error, views, fields) {});
        response.redirect(url);
        response.end();
        }else {
          response.redirect('/');
          response.end();
        }
      });
    };
    exports.ad2= (request, response, next) => {
      conn.query('SELECT * FROM catalogs WHERE pos = 2', function(error, clicks, fields) {
        let click=clicks[0].click;
        let url=clicks[0].url; //chuyển về trang web quảng cáo
        if(url !=null ){
        click=click+1;  //tăng số lần click
        conn.query('UPDATE ec.catalogs SET click=? WHERE pos=2', [click], function(error, views, fields) {});
        response.redirect(url);
        response.end();
        }else {
          response.redirect('/');
          response.end();
        }
      });
    };
    exports.ad3= (request, response, next) => {
      conn.query('SELECT * FROM catalogs WHERE pos = 3', function(error, clicks, fields) {
        let click=clicks[0].click;
        let url=clicks[0].url; //chuyển về trang web quảng cáo
        if(url !=null ){
        click=click+1;  //tăng số lần click
        conn.query('UPDATE ec.catalogs SET click=? WHERE pos=3', [click], function(error, views, fields) {});
        response.redirect(url);
        response.end();
        }else {
          response.redirect('/');
          response.end();
        }
      });
    };
    exports.ad4= (request, response, next) => {
      conn.query('SELECT * FROM catalogs WHERE pos = 4', function(error, clicks, fields) {
        let click=clicks[0].click;
        let url=clicks[0].url; //chuyển về trang web quảng cáo
        if(url !=null ){
        click=click+1;  //tăng số lần click
        conn.query('UPDATE ec.catalogs SET click=? WHERE pos=4', [click], function(error, views, fields) {});
        response.redirect(url);
        response.end();
        }else {
          response.redirect('/');
          response.end();
        }
      });
    };
    exports.ad5= (request, response, next) => {
      conn.query('SELECT * FROM catalogs WHERE pos = 5', function(error, clicks, fields) {
        let click=clicks[0].click;
        let url=clicks[0].url; //chuyển về trang web quảng cáo
        if(url !=null ){
        click=click+1;  //tăng số lần click
        conn.query('UPDATE ec.catalogs SET click=? WHERE pos=5', [click], function(error, views, fields) {});
        response.redirect(url);
        response.end();
        }else {
          response.redirect('/');
          response.end();
        }
      });
    };
    exports.ad6= (request, response, next) => {
      conn.query('SELECT * FROM catalogs WHERE pos = 6', function(error, clicks, fields) {
        let click=clicks[0].click;
        let url=clicks[0].url; //chuyển về trang web quảng cáo
        if(url !=null ){
        click=click+1;  //tăng số lần click
        conn.query('UPDATE ec.catalogs SET click=? WHERE pos=6', [click], function(error, views, fields) {});
        response.redirect(url);
        response.end();
        }else {
          response.redirect('/');
          response.end();
        }
      });
    };
    exports.ad7= (request, response, next) => {
      conn.query('SELECT * FROM catalogs WHERE pos = 7', function(error, clicks, fields) {
        let click=clicks[0].click;
        let url=clicks[0].url; //chuyển về trang web quảng cáo
        if(url !=null ){
        click=click+1;  //tăng số lần click
        conn.query('UPDATE ec.catalogs SET click=? WHERE pos=7', [click], function(error, views, fields) {});
        response.redirect(url);
        response.end();
        }else {
          response.redirect('/');
          response.end();
        }
      });
    };
    exports.ad8= (request, response, next) => {
      conn.query('SELECT * FROM catalogs WHERE pos = 8', function(error, clicks, fields) {
        let click=clicks[0].click;
        let url=clicks[0].url; //chuyển về trang web quảng cáo
        if(url !=null ){
        click=click+1;  //tăng số lần click
        conn.query('UPDATE ec.catalogs SET click=? WHERE pos=8', [click], function(error, views, fields) {});
        response.redirect(url);
        response.end();
        }else {
          response.redirect('/');
          response.end();
        }
      });
    };
    exports.ad9= (request, response, next) => {
      conn.query('SELECT * FROM catalogs WHERE pos = 9', function(error, clicks, fields) {
        let click=clicks[0].click;
        let url=clicks[0].url; //chuyển về trang web quảng cáo
        if(url !=null ){
        click=click+1;  //tăng số lần click
        conn.query('UPDATE ec.catalogs SET click=? WHERE pos=9', [click], function(error, views, fields) {});
        response.redirect(url);
        response.end();
        }else {
          response.redirect('/');
          response.end();
        }
      });
    };
    exports.ad10= (request, response, next) => {
      conn.query('SELECT * FROM catalogs WHERE pos = 10', function(error, clicks, fields) {
        let click=clicks[0].click;
        let url=clicks[0].url; //chuyển về trang web quảng cáo
        if(url !=null ){
        click=click+1;  //tăng số lần click
        conn.query('UPDATE ec.catalogs SET click=? WHERE pos=2=10', [click], function(error, views, fields) {});
        response.redirect(url);
        response.end();
        }else {
          response.redirect('/');
          response.end();
        }
      });
    };
    exports.ad11= (request, response, next) => {
      conn.query('SELECT * FROM catalogs WHERE pos = 11', function(error, clicks, fields) {
        let click=clicks[0].click;
        let url=clicks[0].url; //chuyển về trang web quảng cáo
        if(url !=null ){
        click=click+1;  //tăng số lần click
        conn.query('UPDATE ec.catalogs SET click=? WHERE pos=11', [click], function(error, views, fields) {});
        response.redirect(url);
        response.end();
        }else {
          response.redirect('/');
          response.end();
        }
      });
    };
    exports.ad12= (request, response, next) => {
      conn.query('SELECT * FROM catalogs WHERE pos = 12', function(error, clicks, fields) {
        let click=clicks[0].click;
        let url=clicks[0].url; //chuyển về trang web quảng cáo
        if(url !=null ){
        click=click+1;  //tăng số lần click
        conn.query('UPDATE ec.catalogs SET click=? WHERE pos=12', [click], function(error, views, fields) {});
        response.redirect(url);
        response.end();
        }else {
          response.redirect('/');
          response.end();
        }
      });
    };
    //sửa password customer
    exports.postFixCusPass = function(request, response, next){
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
        conn.query('UPDATE ec.customers SET pass = ? WHERE name=?', [newpass, request.session.adname], function(error, results, fields) {
            if (!error) {
              response.redirect('/cus-control'); 
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

