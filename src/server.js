import express  from "express";
import userRouter from './routers/users.js'
import videoRouter from "./routers/videos.js"
import fileUpload from "express-fileupload";
import fs from 'fs'
import path from "path";
import cors from 'cors'
var app = express()

app.use(express.text())
app.use(express.urlencoded({extended: true}))
app.use(fileUpload());
app.use(express.static("*"));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(cors())
app.use( express.json() )
const PORT = process.env.PORT || 5000



app.get('/', (req, res) => {
    res.send('hello')

})


app.use(userRouter)
app.use(videoRouter)

app.use((error, req, res, next) => {
    if(error.status != 500){
        return res.status(error.status).json({
            status: error.status,
            message: error.message
        })
    }
    
    fs.appendFileSync(path.join(process.cwd(),  'log.txt'),
    `${req.url}___${error.name}___${Date.now()}___${error.status}___${error.message}\n`
    )

    res.status(error.status).json({
        status: error.status,
        message: 'InternalServerError'
    })

    process.exit()
    

})
app.listen(PORT, ()=> console.log(`${PORT} is runing`))