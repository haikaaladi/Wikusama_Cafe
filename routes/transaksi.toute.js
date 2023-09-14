// load express library
const express = require(`express`)

const app=express()

const transaksiController=require(`../controllers/transaksi.controller`)
const { authorization } = require("../controllers/auth.controller")

// allow to read json on body request
app.use(express.json())

// create route to get all transaksi
app.get(`/transaksi`,authorization(["admin","kasir","manajer"]),transaksiController.getTransaksi)

// create rote to add transaksi
app.post(`/transaksi`,authorization(["admin","kasir"]),transaksiController.addTransaksi)

// create route to edit
app.put(`/transaksi/:id_transaksi`,authorization(["admin","kasir"]),transaksiController.updateTransaksi)

// create route to delete
app.delete(`/transaksi/:id_transaksi`,authorization(["admin","kasir"]), transaksiController.deleteTransaksi)

// export app
module.exports=app