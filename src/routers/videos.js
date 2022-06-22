import express from "express";
import { Router } from "express";
import Controller from '../controllers/video.js'
import videoSchemaPut from '../middleware/validation.js'

import checkToken from "../middleware/checkTokens.js"
const router = Router()
// 
router.get('/videos', Controller.GET)
// router.get('/videos', checkToken, Controller.GET)
router.get('/videos/:userId', Controller.getAdminVideos)
router.post('/videos', Controller.POST)
router.get('/view/:filename', Controller.VIEWFILE)
router.get('/download/:filename', Controller.DOWNLOADFILE)
router.put('/admin/videos/:videoId', checkToken, videoSchemaPut, Controller.PUT)
router.delete('/admin/videos/:videoId', checkToken, videoSchemaPut, Controller.DELETE)
// router.post('/login', Controller.LOGIN )
// router.get('/user/:filename', userController.GETAva)


export default router