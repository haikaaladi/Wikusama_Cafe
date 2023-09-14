// call library jwt
const jwt = require(`jsonwebtoken`)
const md5 = require('md5')

// load model user
const userModel = require(`../models/index`).user

async function verifyToken(token) {
    try {
        let secretKey = 'sixnature joss'
        let decode = jwt.verify(token, secretKey)
        return true

    } catch (error) {
        return false
    }
}



exports.authentication = async (request, response) => {
    try {
        // grab  username and password
        let params = {
            username: request.body.username,
            password: md5(request.body.password)
        }

        // check user exist
        let result = await userModel.findOne(
            {
                where: params
            }
        )

        // validate result
        if (result) {
            // if result has exist, generate token
            // define secret key of jwt
            let secretKey = 'sixnature joss'
            // define header of jwt
            let header = {
                algorithm: "HS256"
            }

            // define payload
            let payload = JSON.stringify(result)

            // do generate token using jwt
            let token = jwt.sign(payload, secretKey, header)

            // gift a response
            return response.json({
                status: true,
                token: token,
                message: `Login berhasil`,
                data: result
            })
        } else {
            // if user doesnt exist
            // gift a response
            return response.json({
                status: false,
                message: 'Username atau Password tidak cocok'
            })
        }
    } catch (error) {
        return ({
            status: false,
            message: error.message
        })
    }
}

exports.authorization = (roles) => {
    return async function (request, response, next) {
        try {
            // grab data header
            let headers = request.headers.authorization

            // grab data token
            // bearer token uisbthjfsdjjcdbyucj

            let token = headers?.split(" ")[1]
            // ? digunakan utk antisipasi jika variabel bernilai null / undefined
            // split digunakan utk memecah stringg menjadi array

            if (token == null) {
                return response.status(401).json({
                    status: false,
                    message: `Unathorized`
                })
            }
            // verify token
            if (! await verifyToken(token)) {
                return response.status(401).json({
                    status: false,
                    message: `INVALID TOKEN`
                })
            }

            // decypt token to plain text
            let plainText = jwt.decode(token)

            // check allowed roles
            if (!roles.includes(plainText?.role)) {
                return response.status(401).json({
                    status: false,
                    message: `FORBIDEN ACCESS`
                })
            }

            next()
            
        } catch (error) {
            return response.json({
                status: false,
                message: error.message
            })
        }
    }
}