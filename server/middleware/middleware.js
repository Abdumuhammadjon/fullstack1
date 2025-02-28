const jwt = require("jsonwebtoken");
const redisClient = require("../redisClient");
require("dotenv").config();

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token taqdim etilmagan!" });
    }

    // Tokenni dekod qilish
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Redisdan tokenni olish
    const cachedToken = await redisClient.get(`user:${decoded.id}`);

    if (!cachedToken || cachedToken !== token) {
      return res.status(401).json({ message: "Token yaroqsiz yoki muddati o‘tgan!" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token noto‘g‘ri!" });
  }
};

module.exports = authenticate;
