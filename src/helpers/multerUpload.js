const multer = require("multer");
const path = require("path");

const bigFileDestination = path.join(process.cwd(), "temp");

const storage = multer.diskStorage({
  destination: bigFileDestination,
  filename: function (req, file, cb) {
    const ext = path.parse(file.originalname).ext;
    cb(null, Date.now() + ext);
  },
});

module.exports = multer({ storage });
