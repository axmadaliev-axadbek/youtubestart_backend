import JWT from 'jsonwebtoken'
let secretKey = 'sectretKey'

export default {
    sing: (payload) => JWT.sign(payload, secretKey),
    verify: (token) => JWT.verify(token, secretKey)
}