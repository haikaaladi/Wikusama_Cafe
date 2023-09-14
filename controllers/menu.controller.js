const menuModel = require(`../models/index`).menu

const { request } = require("express")
const joi = require(`joi`)
const { Op } = require("sequelize")

// load path dan fs
const path = require(`path`)
const fs = require('fs')
// load uupload function'
const upload = require(`./upload-menu`)

// create func to validate data menu
const validateMenu = (input) => {
    // define rules of menu
    let rules = joi.object().keys({
        nama_menu: joi.string().required(),
        jenis: joi.string().valid('makanan', 'minuman').required(),
        deskripsi: joi.string().required(),
        harga: joi.number().required()
    })

    // get error of validate
    let { error } = rules.validate(input)
    if (error) {
        let message = error.details.map(item => item.message).join(`,`)

        return {
            status: false,
            message: message
        }
    }
    return {
        status: true
    }

}

// create and export func to get all menu
exports.addMenu = async (request, response) => {
    try {
        const uploadMenu = upload.single(`gambar`)
        uploadMenu(request, response, async error => {
            if (error) {
                return response.json({
                    status: false,
                    message: error.message
                })
            }
            if (!request.file) {
                return response.json({
                    status: false,
                    message: `Nothing file to uploaded`
                })
            }
            // check validation of input
            let resultValidation = validateMenu(request.body)
            if (resultValidation.status == false) {
                return response.json({
                    status: false,
                    message: resultValidation.message
                })
            }
            // slipping filename in request body
            request.body.gambar = request.file.filename
            // insert menu using model
            await menuModel.create(request.body)

            // give a response
            return response.json({
                status: true,
                message: `Data menu berhasil ditambahkan`
            })
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

// func get all menu
exports.getMenu = async (request, response) => {
    try {
        // get all menu  using model
        let result = await menuModel.findAll()
        // give response
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

// create func to filter menu
exports.findMenu = async (request, response) => {
    try {
        let keyword = request.body.keyword
        let result = await menuModel.findAll({
            where: {
                [Op.or]: {
                    nama_menu: { [Op.substring]: keyword },
                    jenis: { [Op.substring]: keyword },
                    deskripsi: { [Op.substring]: keyword }
                }
            }
        })
        // give response
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

// func to update menu
exports.updateMenu = async (request, response) => {
    try {
        const uploadMenu = upload.single(`gambar`)
        uploadMenu(request, response, async error => {
            if (error) {
                return response.json({
                    status: false,
                    message: error
                })
            }
            // get id menu that will be update
            let id_menu = request.params.id_menu

            // grab menu based on selected id menu
            let selectedMenu = await menuModel
                .findOne({ where: { id_menu: id_menu } })

            // check if update withib upload gambar
            if (request.file) {
                let oldFileName = selectedMenu.gambar

                // create path of file
                let pathFile = path.join(__dirname, `../menu_image`, oldFileName)

                // check the existing old file
                if (fs.existsSync(pathFile)) {
                    // delete he old file
                    fs.unlinkSync(pathFile, error => {
                        console.log(error)
                    })
                }
                // insert the file name to request.body
                request.body.gambar = request.file.filename
            }
            // update menu using model
            await menuModel.update(
                request.body,
                { where: { id_menu: id_menu } }
            )
            // give response
            return response.json({
                status: true,
                message: `Data menu telah diupdate`
            })


        }
        )
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

// creat eand export func to delete menu
exports.deleteMenu = async (request, response) => {
    try {
        // get id thaht will be delete
        let id_menu = request.params.id_menu
        // grab menu based on selected id
        let selectedMenu = await menuModel.findOne({ where: { id_menu: id_menu } })

        // definisikan a path of fiile
        let pathFile = path.join(__dirname, `../menu_image`, selectedMenu.gambar)

        // check existing file
        if (fs.existsSync(pathFile)) {
            // delete file
            fs.unlinkSync(pathFile, error => {
                console.log(error);
            })
        }
        // delete menu usinv model
        await menuModel.destroy({
            where: { id_menu: id_menu }
        })
        // give a response
        return response.json({
            status: true,
            message: `Data menu telah dihapus`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}