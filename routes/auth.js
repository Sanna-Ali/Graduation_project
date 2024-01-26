const router = require("express").Router();

const { register, login, verifyUserAccount } = require("../Controllers/auth");

// /api/auth/register
router.post("/register", register);
// /api/auth/:userId/verify/:token
router.get("/:userId/verify/:token", verifyUserAccount);
// /api/auth/login
router.post("/login", login);

module.exports = router;
