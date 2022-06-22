import { logs, read, write } from "../utils/model.js"
import { InternalServerError, AuthrizationError } from "../utils/error.js"
import sha256 from "sha256"
import jwt from "../utils/jwt.js"
import fileUpload from "express-fileupload"
import fs from 'fs'
import path from 'path'
const secretKey = 'secretKey'
const API = `https://youtubebackend12.herokuapp.com`

const GET = (req,res ) => {
    try {
        let users =read('users')
        let {userId} = req.params 

        if(userId) {
            let user = users.filter(user=> user.userId == userId)
            delete user.password
            return  res.status(200).send(user)
        }
        users = users.filter( user => delete user.password)
        users = users.map(user => {
            user.avatar =  `${API}${user.avatar} `
            return user
        })
        res.status(200).send(users)

    } catch (error) {
        
    }

}
const GETAva = (req,res, next) => {
    res.sendFile(path.join(process.cwd(), 'src', 'avatars', req.params.filename))
}

const REGISTER = (req,res, next) =>{
    try {
        let users = read('users')
        let file = req.files.file
        let data = req.body
        let user = users.find(user=> user.username == req.body.username && user.password == sha256(req.body.password))
        
        if(user) {
            console.log('error');
            return next( new AuthrizationError(401, 'this user exists'))
        }
        req.body.password  = sha256(data.password)
        let fileName = file.name.replace(/\s/g, '')
        file.mv(path.join(process.cwd(), 'src', 'avatars', fileName))
        req.body.avatar = '/user/' + fileName
        
        req.body.userId = users.length ? users.at(-1).userId+1: 1
        users.push(req.body)
        write('users', users)
        console.log(req.body);
        delete req.body.password
        
        res.status(201).send({
            status: 201,
            data: req.body,
            message: 'success',
            token: jwt.sing({userId : req.body.userId})
        })
        
    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}

const LOGIN = (req, res, next) => {
    try {
        let {username, password} = req.body
        let users = read('users')
        let user = users.find(user => user.username == username && user.password == sha256(password))
        if(!user) {
            return next(new AuthrizationError(401, 'wrong username and password'))
        }
        delete user.password
        res.status(200).send({
            status: 200,
            message: 'success',
            token: jwt.sing({userId: user.userId}),
            data: user
        })
    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}

export default {
    GET, REGISTER, LOGIN, GETAva
}