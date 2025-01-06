import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteMainBanner, getMainBanners, uploadMainBanner } from "../controllers/mainBanner.controller.js";




const router = Router();



router.route('/add').post(verifyJWT, upload.single('imageUrl'), uploadMainBanner)
router.route('/delete/:id').delete(verifyJWT, deleteMainBanner)
router.route('/get').get(getMainBanners)



export default router