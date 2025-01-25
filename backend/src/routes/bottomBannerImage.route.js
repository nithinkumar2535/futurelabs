import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteBottomBanner, getBottomBanners, getRandomBottomBanner, uploadBottomBanner } from "../controllers/bottomBanner.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route('/add').post(verifyJWT, upload.single('imageUrl'), uploadBottomBanner)
router.route('/delete/:id').delete(verifyJWT, deleteBottomBanner)
router.route('/get').get(getBottomBanners)
router.route('/get-random').get(getRandomBottomBanner)

export default router