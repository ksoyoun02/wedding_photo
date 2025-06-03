// backend/server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;

app.use(express.static(path.join(__dirname, 'static')));

// uploads 폴더가 없으면 생성
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

app.use(cors());
app.use('/upload', (req, res, next) => {
  const name = req.query.name?.trim() || 'default';
  const basePath = path.join(__dirname, 'uploads');
  let folderName = name;
  let fullPath = path.join(basePath, folderName);
  let count = 1;

  // 이름 중복 시 뒤에 -1, -2 붙이기
  while (fs.existsSync(fullPath)) {
    folderName = `${name}-${count++}`;
    fullPath = path.join(basePath, folderName);
  }

  fs.mkdirSync(fullPath, { recursive: true });
  req.uploadDir = fullPath; // 이후 multer에서 사용하게 넣어줌
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, req.uploadDir); // 미들웨어에서 만든 폴더 사용
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '_' + file.originalname;
    cb(null, uniqueName);
  },
});


// 이미지와 비디오만 필터링
const fileFilter = (req, file, cb) => {
  const allowed = ['image/', 'video/'];
  if (allowed.some(type => file.mimetype.startsWith(type))) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });

app.post('/upload', upload.array('files'), (req, res) => {
    const urls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ urls });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
