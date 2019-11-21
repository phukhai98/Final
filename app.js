const path = require('path');
const express = require('express'); //bấm chuột phải vô 'express'->go to defination
const bodyParser = require('body-parser');
const session = require('express-session'); //sử dụng session
const app = express();
app.set('view engine', 'ejs');  //'view engine', 'bug' là 2 hàm của ejs
app.set('views', 'views');
//các table trong database
const sequelize = require('./util/db-sequelize');  //sử dụng database
const Admin = require('./models/admin');
const Code = require('./models/code');
const Customer = require('./models/customer');
const Message = require('./models/message');
const conn = require('./util/database');

//chú ý :

const adminRoutes = require('./routes/admin');  //gọi file admin.js trong thư mục routers
const userRoutes = require('./routes/user');
const errorController = require('./controllers/error');
const cusRoutes = require('./routes/cus');

app.use(bodyParser.urlencoded({extended: false}));
//app.use(express.static(path.join(__dirname, 'public')));    //để lấy giao diện css bên trong cái tập tin tên là public
app.use(express.static(path.join(__dirname, 'PoKeBiz')));
app.use( express.static( "PoKeBiz" ) ); //dòng này giúp khi muốn thêm hình ảnh gì đó, chỉ cần gõ tên hình, còn lại phần mềm sẽ tự mà tìm lấy

//session, để có thể sử dụng trong user (controller)
app.use(
  session({ secret: 'my secret', resave: false, saveUninitialized: false })
);

app.use(adminRoutes.routes);
app.use(userRoutes.routes);
app.use(cusRoutes.routes);

app.use(errorController.get404);

//sử dụng sequelize để thêm dữ liệu ban đầu vào, nếu nó chưa có
sequelize
 .sync()
  .then(result =>{
    return Admin.findByPk('admin') //tìm với id là 1, nếu ko có, tạo cái id đó. Xem phía dưới
  //console.log(result);
})
.then(admin => {
  if(!admin) {
    return Admin.create({name: 'admin', pass: 'admin'}) //tạo trước giá trị trong table
  }
  return admin;
})

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

//cài các thư viện sau trong terminal
//cài express.js để sử dụng Middleware  : npm install --save express

//npm install --save body-parser       //phải cài, chưa cài là ko chạy đc
//nếu bị lỗi [nodemon] app crashed -> thì đánh npm install 
//muốn biết chính xác là lỗi nào, thì coi từ chỗ 'ReferenceError' trong phần terminal

///////////////////////////////////////////////////////////////////////////////////////////////////

//Bắt đầu với mysql
//để connect đc, phải install packet b1:
//npm install --save mysql


///////////////////////////////////////////////////////////////////////////
//cài session 
//npm install express-session

//cài cookie
//npm install cookie-session
//npm install cookie-parser --save
























