const express = require('express');
const path = require('path');
const arithmeticRoutes = require('./routes/arithmetic');
const userRoutes = require('./routes/users');
const PORT = 3000;

const app = express();
app.use(express.json());  // JSON 요청 파싱

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// API 라우트 설정
app.use('/arithmetic', arithmeticRoutes);
app.use('/users', userRoutes);

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
