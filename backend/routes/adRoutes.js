const router = require("express").Router();
const ctrl = require("../controllers/adController");
const { protect, optionalAuth } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/categories", ctrl.getCategories);

router.get("/favorites", protect, ctrl.getFavorites);
router.get("/user/my-ads", protect, ctrl.getMyAds);

router.get("/", optionalAuth, ctrl.getAds);
router.get("/:id", optionalAuth, ctrl.getAd);

router.post("/", protect, upload.array("images", 8), ctrl.createAd);
router.put("/:id", protect, upload.array("images", 8), ctrl.updateAd);
router.delete("/:id", protect, ctrl.deleteAd);
router.put("/:id/favorite", protect, ctrl.toggleFavorite);

module.exports = router;
