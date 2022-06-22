import fs from 'fs'
import path from 'path'
// import users from '../controllers/users'

function read(data) {
    let users = fs.readFileSync(path.join(process.cwd(), 'src', 'database', data +'.json'), 'utf-8')
    return JSON.parse(users) || [] 
}

function write(filename, file) {
     fs.writeFileSync(path.join(process.cwd(), 'src', 'database', filename +'.json'), JSON.stringify(file, null, 4))

    return true
}
function logs() {
    console.log(process.cwd());
}
// read('users')
export {
    read, write, logs
}