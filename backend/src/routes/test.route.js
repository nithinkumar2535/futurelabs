import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addTest, deleteTest, editTest, fechAllTests, fetchAllTestNames, getMenTests, getRandomSixTestsByCategory, getSelectedPackages, getTestsByCategory, getTestsByCategoryAndSubcategory, getTestsById, getWomenTests, updateSelection } from "../controllers/test.controller.js";



const router = Router()

router.route('/add').post(verifyJWT, addTest)
router.route('/edit/:id').put(verifyJWT, editTest)
router.route('/delete/:id').delete(verifyJWT, deleteTest)
router.route('/get').get(fechAllTests)
router.route('/get/:category/:subcategory').get(getTestsByCategoryAndSubcategory)
router.route('/update/:id').patch(verifyJWT, updateSelection)
router.route('/category/:category').get(getTestsByCategory)
router.route('/similar/:category').get(getRandomSixTestsByCategory)
router.route('/selected/:category').get(getSelectedPackages)
router.route('/get-test/:id').get(getTestsById)
router.route('/women-tests/:subcategory').get(getWomenTests)
router.route('/men-tests/:subcategory').get(getMenTests)
router.route('/all-tests').get(fetchAllTestNames)


export default router