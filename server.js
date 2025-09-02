const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

// Serve static files from client/public
app.use(express.static(path.join(__dirname, 'client', 'public')));

// Multer config to save files to public/uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'client', 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    // Save with original name + timestamp for uniqueness
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // Return the public path to the uploaded image
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Upload server running on http://localhost:${PORT}`);
});