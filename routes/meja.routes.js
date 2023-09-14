const express = require(`express`)
const app = express()

// untuk membaca apa yang direquestkan
app.use(express.json())

// memanggil controller
const mejaController = require(`../controllers/meja.controller`)
const { authorization }  = require (`../controllers/auth.controller`)

app.get(`/meja`, authorization(["admin", "manager"]), mejaController.getMeja)
app.get(`/meja/available`, authorization(["admin", "manager","kasir"]), mejaController.availabledMeja)
app.post(`/meja`, authorization(["admin", "manager"]), mejaController.addMeja)
app.put(`/meja/:id_meja`, authorization(["admin", "manager","kasir"]), mejaController.updateMeja)
app.delete(`/meja/:id_meja`, authorization(["admin", "manager"]), mejaController.deleteMeja)

//mengekspor app objek
module.exports = app