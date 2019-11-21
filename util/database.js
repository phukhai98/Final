  var mysql = require('mysql');

  var conn = mysql.createConnection({
  	host     : 'localhost',
  	user     : 'root',
  	password : 'khaipro123',
  	database : 'ec'
  });
conn.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE IF NOT EXISTS catalogs (pos INTEGER PRIMARY KEY, customer_id VARCHAR(255),cart INTEGER, price INTEGER, pic TEXT, url TEXT, start_day DATE, end_day DATE, click INTEGER)";
  conn.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table admins created");
  });
});
 var sql = "INSERT IGNORE INTO catalogs (pos) VALUES ?";
  var values = [
   ['1'], ['2'], ['3'], ['4'], ['5'], ['6'], ['7'], ['8'], ['9'], ['10'], ['11'], ['12']];
 conn.query(sql,[values], function (err, result) {
   if (err) throw err;
   console.log("1 record inserted");
 });
  module.exports = conn;

 
