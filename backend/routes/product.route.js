import express from "express";
import { createProduct ,getAllProducts,  getProductById, updateProductStock, deleteProduct, getProducts, getProductsByCategory} from "../controllers/product.controller.js";
import isAuthenticated from "../middlewares/authenticate.js";
import isAdmin from "../middlewares/isAdmin.js"
const router = express.Router();
import multer from 'multer'
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/",isAuthenticated,isAdmin,upload.single('image'),createProduct);
router.get("/",getAllProducts);
router.get("/page",getProducts);
router.get("/category",getProductsByCategory);
router.get("/:id",isAuthenticated,getProductById);
router.patch("/:id",isAuthenticated,isAdmin,updateProductStock);
router.delete("/:id",isAuthenticated,isAdmin,deleteProduct)

export default router;