const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuid } = require('uuid');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

// make sure folder exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${uuid()}${ext}`);
  }
});

const upload = multer({ storage });

function getFileUrl(req, file) {
  const baseUrl =
    process.env.APP_BASE_URL ||
    `${req.protocol}://${req.get('host')}`;

  return `${baseUrl}/uploads/${file.filename}`;
}

module.exports = {
  upload,
  getFileUrl
};
