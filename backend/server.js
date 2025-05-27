const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { processSecretSanta } = require('./services/secretSantaService');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/api/assign', upload.fields([
  { name: 'employeeFile', maxCount: 1 },
  { name: 'lastYearFile', maxCount: 1 },
]), async (req, res) => {
  try {
    const resultPath = await processSecretSanta(
      req.files.employeeFile[0].path,
        req.files.lastYearFile[0].path
    );
    res.download(resultPath);
  } catch (err) {
    console.error("Error while running script",err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
