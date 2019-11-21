const express = require('express');
const router = express();
const conn = require('../util/database');
const sequelize = require('../util/db-sequelize');  //sử dụng database
const Customer = require('../models/customer');
const cookieSession = require('cookie-session')
const cookieParser  = require('cookie-parser')
const User = require('../models/user')

//home
exports.getHome = (req, res, next) => {
  //vì pos 1 -> 5 nằm chung 1 chỗ, nên chỉ cần 1 cái đại diện là được
  conn.query('SELECT * FROM ec.catalogs WHERE pos=1', function(error, views, fields) {
    conn.query('SELECT * FROM ec.catalogs ', function(error, pic, fields) {
     let view = views[0].view;
     //cộng số lần view vào
     view = view +1;
     //update lại trong catalog
     for(var i=1;i<=5;i++){
      conn.query('UPDATE ec.catalogs SET view=? WHERE pos=?', [view, i], function(error, viewss, fields) {});
       // console.log(view);
     };
     let pic1=pic[1].pic, pic2=pic[2].pic, pic3=pic[3].pic, pic4=pic[4].pic, pic0=pic[0].pic;
    if(pic0 == null) {
        pic0 = "https://www.ifnotthisthenwhat.org/wp-content/uploads/2018/07/HERE.jpg";
     }

    if(pic1 == null) {
      pic1 = "https://www.ifnotthisthenwhat.org/wp-content/uploads/2018/07/HERE.jpg";
    }

      if(pic2 == null) {
        pic2 = "https://www.ifnotthisthenwhat.org/wp-content/uploads/2018/07/HERE.jpg";
      }

      if(pic3 == null) {
        pic3 = "https://www.ifnotthisthenwhat.org/wp-content/uploads/2018/07/HERE.jpg";
      }

         if(pic4 == null) {
      pic4 = "https://www.ifnotthisthenwhat.org/wp-content/uploads/2018/07/HERE.jpg";
   }

    res.render('home.ejs', {
      pic0: pic0,
      pic1: pic1,
      pic2: pic2,
      pic3: pic3,
      pic4: pic4,
      path: '/'
    });
  });
  });
};

//session phải được để trong app.js

exports.getUserLogin = (req, res, next) => {
  //vì vị trí 8-> 11 ở chung 1 form
  conn.query('SELECT * FROM ec.catalogs WHERE pos=8', function(error, views, fields) {
    let view = views[0].view;
    //cộng số lần view vào
    view = view +1;
    //update lại trong catalog
    for(var i=8;i<=11;i++){
     conn.query('UPDATE ec.catalogs SET view=? WHERE pos=?', [view, i], function(error, viewss, fields) {});
      // console.log(view);
    };
    conn.query('SELECT * FROM ec.catalogs ', function(error, pic, fields) {
      let pic7=pic[7].pic, pic8=pic[8].pic, pic9=pic[9].pic, pic10=pic[10].pic;
      if(pic7 == null) {
          pic7 = "https://www.ifnotthisthenwhat.org/wp-content/uploads/2018/07/HERE.jpg";
       }
  
      if(pic8 == null) {
        pic8 = "https://www.ifnotthisthenwhat.org/wp-content/uploads/2018/07/HERE.jpg";
      }
  
        if(pic9 == null) {
          pic9 = "https://www.ifnotthisthenwhat.org/wp-content/uploads/2018/07/HERE.jpg";
        }
  
        if(pic10 == null) {
          pic10 = "https://www.ifnotthisthenwhat.org/wp-content/uploads/2018/07/HERE.jpg";
        }
    res.render('user-login', {
      pic7: pic7,
      pic8: pic8,
      pic9: pic9,
      pic10: pic10,
        path: '/user-login'
    });
  });
});

};

exports.getUserRegister= (req, res, next) => {
  //vì vị trí 6 và 7 ở chung 1 form
  conn.query('SELECT * FROM ec.catalogs WHERE pos=6', function(error, views, fields) {
    let view = views[0].view;
    //cộng số lần view vào
    view = view +1;
    //update lại trong catalog
    for(var i=6;i<=7;i++){
     conn.query('UPDATE ec.catalogs SET view=? WHERE pos=?', [view, i], function(error, viewss, fields) {});
      // console.log(view);
    };
    conn.query('SELECT * FROM ec.catalogs ', function(error, pic, fields) {
      //lấy hình ảnh
      let pic5=pic[5].pic, pic6=pic[6].pic;
    if(pic5 == null) {
        pic5 = "https://www.ifnotthisthenwhat.org/wp-content/uploads/2018/07/HERE.jpg";
     }

    if(pic6 == null) {
      pic6 = "https://www.ifnotthisthenwhat.org/wp-content/uploads/2018/07/HERE.jpg";
    }
    res.render('user-register', {
      //load hình ảnh
      pic6: pic6,
      pic5:pic5,
        path: '/user-register'
    });
  });
  });
};
//register
const money = 100;
const ball =10;
exports.postRegister = (req, res, next)=>{
      //hàm khởi tạo
      const name = req.body.name;
      const pass = req.body.pass;
      sequelize
      .sync()
      .then(result =>{
        return User.findByPk(name) //tìm với id là 1, nếu ko có, tạo cái id đó. Xem phía dưới
      //console.log(result);
    })
      .then(user => {
        if(!user) {
          User.create({name: name, pass: pass, money: money, ball: ball, level: 1, process: 0, gengar: 0, snolax: 0, darkrai: 0, squirtle: 0, charmander: 0, sudowoodo: 0, scyther: 0, diglett: 0, bulbasaur: 0, beedrill: 0, pikachu: 0, gyarados: 0}); //tạo trước giá trị trong table
          //đến trang đăng nhập
          res.redirect('/user-login');
        }
        else{
          res.send('This user name are ready used'); //thông báo khi không thể thêm, thường là do đã sử dụng tài khoản đó
          res.end();//phải có để biết được đó là register-form
        }
      })
};
//login 
exports.postLogin= (request, response, next) => {
  var username = request.body.username;
  var password = request.body.password;
  
  if (username && password) //nếu trong thanh tìm kiếm có dữ liệu, thì truy vấn
  {
		conn.query('SELECT * FROM users WHERE name = ? AND pass = ?', [username, password], function(error, results, fields) {
      if (results.length > 0) {
        //session
        request.session.loggedin = true;    //lưu dữ liệu đã được login vào trong này
        request.session.username = username;
        //request.session.username=""; //delete session
        //console.log( request.session.username);
        response.redirect('/game'); //đúng thì trả về home
        
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

//add code
exports.postAddCode= (request, response, next) => {
  //tìm code nhập vào
  var code = request.body.code;
  conn.query("SELECT * FROM ec.codes WHERE code = ? AND used=0", [code], function (err, code, fields){
    if(code.length >0) {
      //nếu tìm được code có và chưa từng đc sử dụng, thì update vào trong user
      //tìm money trong user đó trước
      conn.query("SELECT * FROM ec.users WHERE name = ? ", [request.session.username], function (err, results, fields){

       let mo = results[0].money ; //tiền trong user, phải sử dụng hàm let, ko đc là const
       mo = mo + code[0].coin;      //cộng tiền cho user từ codes
      //update tiền trong user lên
      conn.query("UPDATE ec.users SET money= ? WHERE name = ? ", [mo, request.session.username], function (err, moneys, fields){
        //chuyển code đã thêm cho user là 'đã sử dụng'
        conn.query("UPDATE ec.codes SET used= 1 WHERE code = ? ", [code[0].code], function (err, result, fields){
          });
        });
      });
      response.redirect('/game'); //để ra ngoài để có thể chạy được 
      //response.end();
    } else {
      response.send('Incorrect Code Name, please try again');
    }
    response.end();
  });
};
///////////////////////////////////////////////////////////////

//play game
exports.getGame = (request, response, next) => {
    //vì pos 12 nằm 1 chỗ
    conn.query('SELECT * FROM ec.catalogs WHERE pos=12', function(error, views, fields) {
      let view = views[0].view;
      //cộng số lần view vào
      view = view +1;
      //update lại trong catalog
      conn.query('UPDATE ec.catalogs SET view=? WHERE pos=?', [view, '12'], function(error, viewss, fields) {});
        // console.log(view);
    });
    conn.query('SELECT * FROM ec.catalogs ', function(error, pic, fields) {
//
    let pic11=pic[11].pic;
    if(pic11 == null) {
        pic11 = "https://www.ifnotthisthenwhat.org/wp-content/uploads/2018/07/HERE.jpg";
    }
  User.findByPk(request.session.username)
  .then(pokemon => {
    response.render('map', {
      pic11:pic11,
      pokemon: pokemon,
      path: '/game'
    });
  })
  .catch(err => console.log(err));
  });

};
//pokemon
exports.postStop = (request, response, next) => {
  //1. tìm giá trị cần sửa
  conn.query("SELECT * FROM ec.users WHERE name = ? ", [request.session.username], function (err, code, fields){
    if(!err){
      let mo = code[0].money;
      let ball = code[0].ball;
      mo = mo +1;
      ball = ball +1;
       //2.update các giá trị bên trong bảng user
      conn.query("UPDATE ec.users SET money= ?, ball= ? WHERE name = ? ", [mo, ball, request.session.username], function (err, moneys, fields){
      });
      response.redirect('/game');
    }else {
      response.send('Oop! Something error, please restart browser');
    }
    response.end();
  });
};
//polemon 
exports.poke1 = (request, response, next) => {
  //1. tìm giá trị cần sửa
  conn.query("SELECT * FROM ec.users WHERE name = ?", [request.session.username], function (err, code, fields){
    if(!err){
      let poke = code[0].gengar;
      poke = poke +1;
      let proc = code[0].process;
      proc = proc + 10;
      let level = code[0].level;
      let ball = code[0].ball;
      if(ball == 0 ){
        return response.send('You don not have any ball, please buy some new ball');
      }
      ball=ball-1;
      if(proc == 100){
          level = level +1;
          proc =0;
      }
       //2.update các giá trị bên trong bảng user
      conn.query("UPDATE ec.users SET gengar= ?, level= ?, process=  ?, ball= ? WHERE name = ? ", [poke, level, proc, ball, request.session.username], function (err, moneys, fields){
      });

      response.redirect('/game');
    }else {
      response.send('Oop! Something error, please restart browser');
    }
    response.end();
  });
};

exports.poke2 = (request, response, next) => {
  //1. tìm giá trị cần sửa
  conn.query("SELECT * FROM ec.users WHERE name = ?", [request.session.username], function (err, code, fields){
    if(!err){
      let poke = code[0].scyther;
      poke = poke +1;
      let proc = code[0].process;
      proc = proc + 10;
      let level = code[0].level;
      let ball = code[0].ball;
      if(ball == 0 ){
        return response.send('You don not have any ball, please buy some new ball');
      }
      ball=ball-1;
      if(proc == 100){
          level = level +1;
          proc =0;
      }
       //2.update các giá trị bên trong bảng user
      conn.query("UPDATE ec.users SET scyther= ?, level= ?, process=  ?, ball= ? WHERE name = ? ", [poke, level, proc, ball, request.session.username], function (err, moneys, fields){
      });

      response.redirect('/game');
    }else {
      response.send('Oop! Something error, please restart browser');
    }
    response.end();
  });
};

exports.poke3 = (request, response, next) => {
  //1. tìm giá trị cần sửa
  conn.query("SELECT * FROM ec.users WHERE name = ?", [request.session.username], function (err, code, fields){
    if(!err){
      let poke = code[0].sudowoodo;
      poke = poke +1;
      let proc = code[0].process;
      proc = proc + 10;
      let level = code[0].level;
      let ball = code[0].ball;
      if(ball == 0 ){
        return response.send('You don not have any ball, please buy some new ball');
      }
      ball=ball-1;
      if(proc == 100){
          level = level +1;
          proc =0;
      }
       //2.update các giá trị bên trong bảng user
      conn.query("UPDATE ec.users SET sudowoodo= ?, level= ?, process=  ?, ball= ? WHERE name = ? ", [poke, level, proc, ball, request.session.username], function (err, moneys, fields){
      });

      response.redirect('/game');
    }else {
      response.send('Oop! Something error, please restart browser');
    }
    response.end();
  });
};

exports.poke4 = (request, response, next) => {
  //1. tìm giá trị cần sửa
  conn.query("SELECT * FROM ec.users WHERE name = ?", [request.session.username], function (err, code, fields){
    if(!err){
      let poke = code[0].darkrai;
      poke = poke +1;
      let proc = code[0].process;
      proc = proc + 10;
      let level = code[0].level;
      let ball = code[0].ball;
      if(ball == 0 ){
        return response.send('You don not have any ball, please buy some new ball');
      }
      ball=ball-1;
      if(proc == 100){
          level = level +1;
          proc =0;
      }
       //2.update các giá trị bên trong bảng user
      conn.query("UPDATE ec.users SET darkrai= ?, level= ?, process=  ?, ball= ? WHERE name = ? ", [poke, level, proc, ball, request.session.username], function (err, moneys, fields){
      });

      response.redirect('/game');
    }else {
      response.send('Oop! Something error, please restart browser');
    }
    response.end();
  });
};

exports.poke5 = (request, response, next) => {
  //1. tìm giá trị cần sửa
  conn.query("SELECT * FROM ec.users WHERE name = ?", [request.session.username], function (err, code, fields){
    if(!err){
      let poke = code[0].beedrill;
      poke = poke +1;
      let proc = code[0].process;
      proc = proc + 10;
      let level = code[0].level;
      let ball = code[0].ball;
      if(ball == 0 ){
        return response.send('You don not have any ball, please buy some new ball');
      }
      ball=ball-1;
      if(proc == 100){
          level = level +1;
          proc =0;
      }
       //2.update các giá trị bên trong bảng user
      conn.query("UPDATE ec.users SET beedrill= ?, level= ?, process=  ?, ball= ? WHERE name = ? ", [poke, level, proc, ball, request.session.username], function (err, moneys, fields){
      });

      response.redirect('/game');
    }else {
      response.send('Oop! Something error, please restart browser');
    }
    response.end();
  });
};

exports.poke6 = (request, response, next) => {
  //1. tìm giá trị cần sửa
  conn.query("SELECT * FROM ec.users WHERE name = ?", [request.session.username], function (err, code, fields){
    if(!err){
      let poke = code[0].diglett;
      poke = poke +1;
      let proc = code[0].process;
      proc = proc + 10;
      let level = code[0].level;
      let ball = code[0].ball;
      if(ball == 0 ){
        return response.send('You don not have any ball, please buy some new ball');
      }
      ball=ball-1;
      if(proc == 100){
          level = level +1;
          proc =0;
      }
       //2.update các giá trị bên trong bảng user
      conn.query("UPDATE ec.users SET diglett= ?, level= ?, process=  ?, ball= ? WHERE name = ? ", [poke, level, proc, ball, request.session.username], function (err, moneys, fields){
      });

      response.redirect('/game');
    }else {
      response.send('Oop! Something error, please restart browser');
    }
    response.end();
  });
};

exports.poke7 = (request, response, next) => {
  //1. tìm giá trị cần sửa
  conn.query("SELECT * FROM ec.users WHERE name = ?", [request.session.username], function (err, code, fields){
    if(!err){
      let poke = code[0].snolax;
      poke = poke +1;
      let proc = code[0].process;
      proc = proc + 10;
      let level = code[0].level;
      let ball = code[0].ball;
      if(ball == 0 ){
        return response.send('You don not have any ball, please buy some new ball');
      }
      ball=ball-1;
      if(proc == 100){
          level = level +1;
          proc =0;
      }
       //2.update các giá trị bên trong bảng user
      conn.query("UPDATE ec.users SET snolax= ?, level= ?, process=  ?, ball= ? WHERE name = ? ", [poke, level, proc, ball, request.session.username], function (err, moneys, fields){
      });

      response.redirect('/game');
    }else {
      response.send('Oop! Something error, please restart browser');
    }
    response.end();
  });
};

exports.poke8 = (request, response, next) => {
  //1. tìm giá trị cần sửa
  conn.query("SELECT * FROM ec.users WHERE name = ?", [request.session.username], function (err, code, fields){
    if(!err){
      let poke = code[0].bulbasaur;
      poke = poke +1;
      let proc = code[0].process;
      proc = proc + 10;
      let level = code[0].level;
      let ball = code[0].ball;
      if(ball == 0 ){
        return response.send('You don not have any ball, please buy some new ball');
      }
      ball=ball-1;
      if(proc == 100){
          level = level +1;
          proc =0;
      }
       //2.update các giá trị bên trong bảng user
      conn.query("UPDATE ec.users SET bulbasaur= ?, level= ?, process=  ?, ball= ? WHERE name = ? ", [poke, level, proc, ball, request.session.username], function (err, moneys, fields){
      });

      response.redirect('/game');
    }else {
      response.send('Oop! Something error, please restart browser');
    }
    response.end();
  });
};

exports.poke9 = (request, response, next) => {
  //1. tìm giá trị cần sửa
  conn.query("SELECT * FROM ec.users WHERE name = ?", [request.session.username], function (err, code, fields){
    if(!err){
      let poke = code[0].squirtle;
      poke = poke +1;
      let proc = code[0].process;
      proc = proc + 10;
      let level = code[0].level;
      let ball = code[0].ball;
      if(ball == 0 ){
        return response.send('You don not have any ball, please buy some new ball');
      }
      ball=ball-1;
      if(proc == 100){
          level = level +1;
          proc =0;
      }
       //2.update các giá trị bên trong bảng user
      conn.query("UPDATE ec.users SET squirtle= ?, level= ?, process=  ?, ball= ? WHERE name = ? ", [poke, level, proc, ball, request.session.username], function (err, moneys, fields){
      });

      response.redirect('/game');
    }else {
      response.send('Oop! Something error, please restart browser');
    }
    response.end();
  });
};

exports.poke10 = (request, response, next) => {
  //1. tìm giá trị cần sửa
  conn.query("SELECT * FROM ec.users WHERE name = ?", [request.session.username], function (err, code, fields){
    if(!err){
      let poke = code[0].charmander;
      poke = poke +1;
      let proc = code[0].process;
      proc = proc + 10;
      let level = code[0].level;
      let ball = code[0].ball;
      if(ball == 0 ){
        return response.send('You don not have any ball, please buy some new ball');
      }
      ball=ball-1;
      if(proc == 100){
          level = level +1;
          proc =0;
      }
       //2.update các giá trị bên trong bảng user
      conn.query("UPDATE ec.users SET charmander= ?, level= ?, process=  ?, ball= ? WHERE name = ? ", [poke, level, proc, ball, request.session.username], function (err, moneys, fields){
      });

      response.redirect('/game');
    }else {
      response.send('Oop! Something error, please restart browser');
    }
    response.end();
  });
};

exports.poke11 = (request, response, next) => {
  //1. tìm giá trị cần sửa
  conn.query("SELECT * FROM ec.users WHERE name = ?", [request.session.username], function (err, code, fields){
    if(!err){
      let poke = code[0].gyarados;
      poke = poke +1;
      let proc = code[0].process;
      proc = proc + 10;
      let level = code[0].level;
      let ball = code[0].ball;
      if(ball == 0 ){
        return response.send('You don not have any ball, please buy some new ball');
      }
      ball=ball-1;
      if(proc == 100){
          level = level +1;
          proc =0;
      }
       //2.update các giá trị bên trong bảng user
      conn.query("UPDATE ec.users SET gyarados= ?, level= ?, process=  ?, ball= ? WHERE name = ? ", [poke, level, proc, ball, request.session.username], function (err, moneys, fields){
      });

      response.redirect('/game');
    }else {
      response.send('Oop! Something error, please restart browser');
    }
    response.end();
  });
};

exports.poke12 = (request, response, next) => {
  //1. tìm giá trị cần sửa
  conn.query("SELECT * FROM ec.users WHERE name = ?", [request.session.username], function (err, code, fields){
    if(!err){
      let poke = code[0].pikachu;
      poke = poke +1;
      let proc = code[0].process;
      proc = proc + 10;
      let level = code[0].level;
      let ball = code[0].ball;
      if(ball == 0 ){
        return response.send('You don not have any ball, please buy some new ball');
      }
      ball=ball-1;
      if(proc == 100){
          level = level +1;
          proc =0;
      }
       //2.update các giá trị bên trong bảng user
      conn.query("UPDATE ec.users SET pikachu= ?, level= ?, process=  ?, ball= ? WHERE name = ? ", [poke, level, proc, ball, request.session.username], function (err, moneys, fields){
      });

      response.redirect('/game');
    }else {
      response.send('Oop! Something error, please restart browser');
    }
    response.end();
  });
};
//////////////////////////////////////////////////////////////////////////
//buy pokemon
exports.pk6 = (request, response, next) => {
  //1. tìm giá trị cần sửa
  conn.query("SELECT * FROM ec.users WHERE name = ?", [request.session.username], function (err, code, fields){
   if(!err){
     let poke = code[0].sudowoodo;
     let money = code[0].money;
     if(money< 1000 ){
       return response.send('You don not have enough coin');
     }
     money=money-1000;  //trừ tiền đi sau khi mua
     poke = poke +1; //cộng pokemon sau khi mua
      //2.update các giá trị bên trong bảng user
     conn.query("UPDATE ec.users SET sudowoodo= ?, money=? WHERE name = ? ", [poke, money, request.session.username], function (err, moneys, fields){
     });

     response.redirect('/game');
   }else {
     response.send('Oop! Something error, please restart browser');
   }
   response.end();
 });
};
exports.pk8 = (request, response, next) => {
  //1. tìm giá trị cần sửa
  conn.query("SELECT * FROM ec.users WHERE name = ?", [request.session.username], function (err, code, fields){
   if(!err){
     let poke = code[0].diglett;
     let money = code[0].money;
     if(money< 1500 ){
       return response.send('You don not have enough coin');
     }
     money=money-1500;  //trừ tiền đi sau khi mua
     poke = poke +1; //cộng pokemon sau khi mua
      //2.update các giá trị bên trong bảng user
     conn.query("UPDATE ec.users SET diglett= ?, money=? WHERE name = ? ", [poke, money, request.session.username], function (err, moneys, fields){
     });

     response.redirect('/game');
   }else {
     response.send('Oop! Something error, please restart browser');
   }
   response.end();
 });
};
//pokeball
exports.ball = (request, response, next) => {
  //1. tìm giá trị cần sửa
  conn.query("SELECT * FROM ec.users WHERE name = ?", [request.session.username], function (err, code, fields){
   if(!err){
     let poke = code[0].ball;
     let money = code[0].money;
     if(money< 100 ){
       return response.send('You don not have enough coin');
     }
     money=money-100;  //trừ tiền đi sau khi mua
     poke = poke +1; //cộng ball sau khi mua
      //2.update các giá trị bên trong bảng user
     conn.query("UPDATE ec.users SET ball= ?, money=? WHERE name = ? ", [poke, money, request.session.username], function (err, moneys, fields){
     });

     response.redirect('/game');
   }else {
     response.send('Oop! Something error, please restart browser');
   }
   response.end();
 });
};
//thay đổi password
exports.postFixUserPass = function(request, response, next){
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
    conn.query('UPDATE ec.users SET pass = ? WHERE name=?', [newpass, request.session.username], function(error, results, fields) {
        if (!error) {
          response.redirect('/user-login'); 
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
//res.render là cái ejs, đường dẫn đến file đó, trong folder views
// path: là đường dẫn trên browser, path bên này và bên route phải giống nhau