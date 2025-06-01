// backend/server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;

// uploads 폴더가 없으면 생성
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

app.use(cors());
app.use('/uploads', express.static(uploadPath));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '_' + file.originalname;
    cb(null, uniqueName);
  }
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
    //const name = req.body.name;
    //const phone = req.body.phone;

    const urls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ urls });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
