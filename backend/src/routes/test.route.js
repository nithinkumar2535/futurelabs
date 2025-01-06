import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addTest, deleteTest, editTest, fechAllTests, getRandomSixTestsByCategory, getSelectedPackages, getTestsByCategory, getTestsByCategoryAndSubcategory, getTestsById, updateSelection } from "../controllers/test.controller.js";



const router = Router()

router.route('/add').post(verifyJWT, addTest)
router.route('/edit/:id').put(verifyJWT, editTest)
router.route('/delete/:id').delete(verifyJWT, deleteTest)
router.route('/get').get(fechAllTests)
router.route('/get/:category/:subcategory').get(getTestsByCategoryAndSubcategory)
router.route('/update/:id').patch(verifyJWT, updateSelection)
router.route('/:category').get(getTestsByCategory)
router.route('/similar/:category').get(getRandomSixTestsByCategory)
router.route('/selected/:category').get(getSelectedPackages)
router.route('/get-test/:id').get(getTestsById)


export default router