const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only JPG, PNG, PDF allowed.'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } 
});

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', upload.single('file'), (req, res) => {
  res.redirect(`/?success=1&filename=${req.file.originalname}`);
});

app.use((err, req, res, next) => {
  res.redirect(`/?error=1&message=${encodeURIComponent(err.message)}`);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
