const router = require("express").Router();
const passport = require("passport");
const ctrl = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/me", protect, ctrl.getMe);
router.put("/profile", protect, upload.single("avatar"), ctrl.updateProfile);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  ctrl.googleCallback,
);

module.exports = router;
