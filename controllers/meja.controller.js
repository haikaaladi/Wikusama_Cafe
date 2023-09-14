// function utk mengolah request dan memberikan response

const { response, request } = require("express")

// call model meja
const mejaModel = require(`../models/index`).meja

// call joi library
const joi = require(`joi`)

// define func to validate input of meje
const validateMeja = async (input) => {
    // define rules of validation
    let rules = joi.object().keys({
        nomor_meja: joi.string().required(),
        status: joi.boolean().required()
    })
    // validation proses
    let { error } = rules.validate(input)

    if (error) {
        // arrange a error message of validation
        let message = error
            .details
            .map(item => item.message)
            .join(`,`)
        return {
            status: false,
            message: message
        }
    }
    return { status: true }
}

// create and export function to load meja
exports.getMeja = async (request, response) => {
    try {
        // memanggil meja dari db menggunakan model
        let meja = await mejaModel.findAll()
        // memberikan response within meja
        return response.json({
            status: true,
            data: meja
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}
// create & exports function to filter available meja
exports.availabledMeja = async (request, response) => {
    try {
        // defina parameter untuk tsatus true
        let param = { status: true }

        // get data meja dari db with defined filter
        let meja = await mejaModel.findAll({ where: param })

        // memberikan response
        return response.json({
            status: true,
            data: meja
        })

    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}
// create and export function to add new meja
exports.addMeja = async (request, response) => {
    try {
        // validasi data
        let resultValidation = validateMeja(request.body)
        if (resultValidation.status==false) {
            return response.json({
                status: false,
                message: (resultValidation).message
            })
        }
        // insert data meja to db using model
        await mejaModel.create(request.body)

        // give a response to ttell insert sukses
        return response.json({
            status: true,
            message: `Data meja berhasil ditambahkan`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}
// create and export func to update meja
exports.updateMeja = async (request, response) => {
    try {
        // get parameter for ubdate
        let id_meja = request.params.id_meja

        // validate data meja
        let resultValidation = validateMeja(request.body)
        if (resultValidation.status==false) {
            // jika validasi slh
            return response.json({
                status: false,
                message: resultValidation.message
            })
        }
        // process run update meja using model
        await mejaModel.update(request.body, {
            where: { id_meja: id_meja }
        })
        // give response
        return response.json({
            status: true,
            message: `Data meja berhasil diubah`
        })
        
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}
// create function deleted meja
exports.deleteMeja=async(request,response)=>{
    try {
        // get id_meja that will be delete
        let id_meja=request.params.id_meja

        // run delete
        await mejaModel.destroy({
            where:{id_meja:id_meja}
        })

        // give a response
        return response.json({
            status: true,
            message:  `Data meja berhasil dihapus`
        }) 
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        }) 
    }
}