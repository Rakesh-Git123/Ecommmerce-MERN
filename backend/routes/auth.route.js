import express from "express";
import isAuthenticated from "../middlewares/authenticate.js";
import isAdmin from "../middlewares/isAdmin.js";
import {  login, signup, forgetPassword, getAllUsers, deleteUser, checkAuth, updateProfile } from "../controllers/auth.controller.js";

const router=express.Router();
import multer from 'multer'
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/signup",signup);
router.post("/login",login);
router.patch("/forgetPassword",forgetPassword)
router.get("/checkAuth",isAuthenticated,checkAuth)
router.patch("/updateProfile",isAuthenticated,upload.single("profilePic"), updateProfile)

router.get("/",isAuthenticated,isAdmin,getAllUsers)
router.delete("/:id",isAuthenticated,isAdmin,deleteUser)
export default router;