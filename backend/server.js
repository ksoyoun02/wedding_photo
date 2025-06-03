// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;

// 미들웨어
app.use(cors());
app.use(express.static(path.join(__dirname, 'static')));

// 정적 파일 서빙 (업로드된 이미지/비디오 접근 가능하게)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// uploads 디렉토리 없으면 생성
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// upload 라우터 연결
const uploadRouter = require('./routes/upload');
app.use('/upload', uploadRouter);

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
