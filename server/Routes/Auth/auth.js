const express = require("express");
const { register, login } = require("../../Controllers/Auth/auth");
const authenticate = require("../../middleware/middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authenticate, (req, res) => {
    res.json({ message: `Xush kelibsiz, foydalanuvchi ID: ${req.user.id}` });
  });

module.exports = router;
