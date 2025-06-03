// routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// 업로드 전 폴더 생성 미들웨어
router.use((req, res, next) => {
  const name = req.query.name?.trim() || 'default';
  const basePath = path.join(__dirname, '../uploads');
  let folderName = name;
  let fullPath = path.join(basePath, folderName);
  let count = 1;

  while (fs.existsSync(fullPath)) {
    folderName = `${name}-${count++}`;
    fullPath = path.join(basePath, folderName);
  }

  fs.mkdirSync(fullPath, { recursive: true });
  req.uploadDir = fullPath;
  req.folderName = folderName; // 나중에 응답에 사용할 수도 있음
  next();
});

// multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, req.uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/', 'video/'];
  if (allowed.some(type => file.mimetype.startsWith(type))) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });

// 실제 업로드 처리
router.post('/', upload.array('files'), (req, res) => {
  const folder = req.folderName;
  const urls = req.files.map(file => `/uploads/${folder}/${file.filename}`);
  res.json({ urls });
});

module.exports = router;
