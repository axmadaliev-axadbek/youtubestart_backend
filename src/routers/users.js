import express from "express";
import { Router } from "express";
import userController from '../controllers/users.js'
import checkToken from "../middleware/checkTokens.js"
const router = Router()


router.get('/users', userController.GET)
router.post('/register', userController.REGISTER)
router.post('/login', userController.LOGIN )
router.get('/user/:filename', userController.GETAva)


export default router