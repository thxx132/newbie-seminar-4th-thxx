const mysql = require('mysql');

// MySQL 연결 설정
const db = mysql.createConnection({
  host: '143.248.234.161',
  user: 'root',  // MySQL 사용자 이름
  password: 'cT9taLIgN52DGI5utcDDiMpw01mwry5s',  // MySQL 비밀번호
  database: 'testdb',  // 사용할 데이터베이스 이름
});

// MySQL 연결
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');
});

module.exports = db;
