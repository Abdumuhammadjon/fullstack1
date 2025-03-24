const express = require("express");
const router = express.Router();
const {
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
} = require("../../Controllers/Auth/fanlar");

router.post("/subjects", createSubject);
router.get("/subjects", getSubjects);
router.put("/subjects/:id", updateSubject);
router.delete("/subjects/:id", deleteSubject);

module.exports = router;
