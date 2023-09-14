// load model of user
const userModel = require(`../models/index`).user

const { string } = require("joi")
const joi = require(`joi`)
const { Op } = require("sequelize")
const md5 = require(`md5`)

//  create validation func
let validateUser = async (input) => {
    // make rules of validation
    let rules = joi.object().keys({
        nama_user: joi.string().required(),
        role: joi.string().validate(`kasir`, `admin`, `manajer`),
        username: joi.string().required(),
        password: joi.string().min(3)
    })

    // proses validation
    let { error } = rules.validate(input)
    // check error validate
    if (error) {
        let message = error.details.map(
            item => item.message
        )
            .join(",")

        return {
            status: false,
            message: message
        }
    }
    return {
        status: true,
    }
}

// create and export func to gett all user
exports.getUser = async (request, response) => {
    try {
        // get all user using model
        let result = await userModel.findAll()

        // give response\
        return response.json({
            status: true,
            data: result
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

// create func to findnuser
exports.findUser = async (request, response) => {
    try {
        // get the keyword of search
        let keyword = request.body.keyword
        // get user baset on keyword
        let result = await userModel.findAll({
            where: {
                [Op.or]: {
                    nama_user: { [Op.substring]: keyword },
                    role: { [Op.substring]: keyword },
                    username: { [Op.substring]: keyword }
                }
            }
        })
        return response.json({
            status: true,
            data: result
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

// create func add user
exports.addUser = async (request, response) => {
    try {
        //validate request
        let resultValidation = validateUser(request.body)
        if (resultValidation.status === false) {
            return response.json({
                status: false,
                message: resultValidation.message
            })
        }
        // convert a password md5
        request.body.password = md5(request.body.password)

        // execute insert user using model
        await userModel.create(request.body)

        // give response
        return response.json({
            status: true,
            message: `Data user berhasil ditambahkan`
        })

    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

// create and export func to update user
exports.updateUser = async (request, response) => {
    try {
        // get id user that will be update
        let id_user = request.params.id_user

        // validate request body
        let resultValidation = validateUser(request.body)

        // chheck result validation
        if (resultValidation.status === false) {
            return response.json({
                status: false,
                message: resultValidation.message
            })
        }
        // convert passwor md5 id exist
        if (request.body.password){
            request.body.password = md5(request.body.password) 

        }

        // execute update user
        await userModel.update(
            request.body,
            {where: {id_user:id_user}}
        )

        return response.json({
            status: true,
            message:`Data user telah diubah`
        })

    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

// create and export func to delete
exports.deleteUser=async(request,response)=>{
    try {
        // get id_user that will be delete
        let id_user=request.params.id_user

        // execute delete user using model
        await userModel.destroy({
            where:{id_user:id_user}
        })
        // give a response
        return response.json({
            status: true,
            message: `Data user telah dihapus lebur`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}