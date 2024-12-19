var express = require('express');
const multer = require('multer');
var router = express.Router();
var path = require('path')
var { processArchitecture } = require('../scripts/processArchitecture');
const fsPromises = require('fs/promises');


// configure storage engine and filename
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

// intercept incoming requests on API,  and add workspace zip to req object:
const zip_filename = 'workspaceZip'
const uploadZipAdd = multer({
  storage: storage,
  limits: { fileSize: 100000000 } // 100MB file size limit
}).single(zip_filename);


//// ## ENDPOINTS
// endpoint for LLM queries
router.post('/', uploadZipAdd, async function(req, res, next) {

  // check if input contains necessary fields
  if (!validateInput(req)) { 
    return res.status(400).json({ error: 'no workspace zip provided' });
  }

  const zipFilePath = req.file.path; // path to uploaded zip file
  const extractDir = 'uploads/'; // directory where to extract temp files into
  const language = req.body.language;

  try {
    const result = await processArchitecture(zipFilePath, extractDir, language)

    res.json({"output":result});

  } catch (error) {
      console.log("Error processing request:", error);
      res.status(500).json({ error: 'Error processing architectural analysis' });

  }
});

router.get('/', async function(req, res, next) {
  res.render('query', {});
});

// ##aux funcs
// validate if input contains zip (docs or commits) to send to llm
function validateInput(req) {

  if (!req.file) {
      return false;
  }
  return true
}

module.exports = router;