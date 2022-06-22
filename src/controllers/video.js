import path from 'path'
import { write,read } from "../utils/model.js"
import moment from 'moment'
import fs from 'fs'
import { ValidationError, InternalServerError, notFoundedError } from '../utils/error.js'
import Joi from 'joi'
import jwt from '../utils/jwt.js'
const API = `https://youtubebackend12.herokuapp.com`

const GET = (req, res) => {
    try {
        let videos = read('videos')
        let users = read('users')
        let  {userId, search} = req.query
        // console.log(req.query.userId);
        if(req.url == '/admin/videos') userId = req.userId
        let data = videos.filter(video => {
            let byuserId = userId ? video.userId == userId : true
            let bysearch = search ? video.title.toLowerCase().includes(search.toLowerCase()) : true
            return byuserId && bysearch
        })

        data = data.map( video =>{
            video.user = video.userId ? users.find(user => user.userId == video.userId) : 2
            // delete video.userId
            delete video.user.password
            return video
        })
        res.send(data)
    } catch (error) {
        console.log(error);
    }
} 

const POST = (req, res, next) => {
    try {
        let videos = read('videos')
        let users = read('users')
        let file = req.files
        req.body.videoId = videos.length ? videos.at(-1).videoId+1 : 1
        
        if(file.file.size > 1024*1024*50) {
            return next(new ValidationError(400, 'Invalid video size'))
        } 
        if(!['video/mp4', 'video/mov'].includes(file.file.mimetype)) {
            return next(new ValidationError(400, 'Invalid video format'))
        } 
        if(file) {
            let filename = file.file.name.replace(/\s/g, '')
            file.file.mv(path.join(process.cwd(), 'src', 'uploads', filename))
            req.body.file = {
                viewlink:  `${API}/view/${filename}`,
                downloadlink: `${API}/download/${filename}`
            }
            req.body.type = 'file'
        }else {
            delete req.body.file
            req.body.type = 'text'
        }
        req.body.date = moment().format('L');
        var today = new Date();
        req.body.time = `${today.getHours()}:${today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes()}`
        req.body.size = file.file.size
        req.body.mimetype = file.file.mimetype
        videos.push(req.body)
        write('videos', videos)
        res.status(201).send({
            status: 201,
            message : "new video added",
            data: req.body
        })
    } catch (error) {
        return next( new InternalServerError(500, error.message) )  
    }
} 


const getAdminVideos = (req, res, next) => {
    try {
        let videos = read('videos')

        let {userId} = req.params
        if(!userId) return

        let data = videos.filter(video => video.user.userId == userId)
        res.status(200).send(data)
    } catch (error) {
        
    }
}

const PUT = (req, res, next) => {
    try {
        let videos = read('videos')
        let users = read('users')
        // let {userId} = jwt.verify(req.headers.token)
        // let video = videos.find( video => video.videoId == req.params.videoId && video.userId == userId)
        let video = videos.find( video => video.videoId == req.params.videoId)
        
        if(!video) {
            return next( new notFoundedError(404, 'video not found'))
        }
        video.title = req.body.title
        write('videos', videos)

        res.status(200).send({
            status: 200,
            message : "video  updated",
            data: video
        })
    } catch (error) {
        return next( new InternalServerError(500, error.message) )  
    }
}

const DELETE = (req, res, next) => {
    try {
        let videos = read('videos')
        let users = read('users')
        // let {userId} = jwt.verify(req.headers.token)
        // let video = videos.find( video => video.videoId == req.params.videoId && video.userId == userId)
        let video = videos.find( video => video.videoId == req.params.videoId)
        
        if(!video) {
            return next( new notFoundedError(404, 'video not found'))
        }
        videos = videos.filter(file => file.videoId != video.videoId) 
        console.log(videos);
        write('videos', videos)
        video.user = users.find(user=> user.userId == req.userId)
        delete video.userId
        delete video.user.password
        res.status(200).send({
            status: 200,
            message : "video  is deleted",
            data: video
        })
    } catch (error) {
        return next( new InternalServerError(500, error.message) )  
    }
}


const VIEWFILE = (req,res) => {
    res.sendFile(path.join(path.join(process.cwd(), 'src', 'uploads', req.params.filename)))
}
const DOWNLOADFILE = (req,res) => {
    res.download(path.join(path.join(process.cwd(), 'src', 'uploads', req.params.filename)))
}
export default {
    GET, POST,  VIEWFILE, DOWNLOADFILE, PUT, DELETE, getAdminVideos
}