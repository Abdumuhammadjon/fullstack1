const express = require("express");
const router = express.Router();
const {
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject, checkAnswers , getQuestionsBySubject,
} = require("../../Controllers/Auth/fanlar");
const {
   getAdmins,
} = require("../../Controllers/Auth/fanlar")


router.get("/admins", getAdmins);

router.post("/subjects", createSubject);
router.post("/save-answers", checkAnswers);
router.get("/subjects", getSubjects);
router.put("/subjects/:id", updateSubject);
router.delete("/subjects/:id", deleteSubject);
router.get("/subject/:id", getQuestionsBySubject)

module.exports = router;
