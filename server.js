const express = require(`express`)
const app = express()
const cors = require(`cors`)

app.use(cors())

// define port for the server
const PORT = 8000

// load a route of meja
const mejaRoute = require(`./routes/meja.routes`)

// load a route of menu
const menuRoute = require(`./routes/menu.route`)

// load a route of menu
const userRoute = require(`./routes/user.route`)

// load a route of menu
const transaksiRoute = require(`./routes/transaksi.toute`)

// load a route of menu
const authRoute = require(`./routes/auth.route`)

// register route of meja
app.use(mejaRoute)

// register route of menu
app.use(menuRoute)

// register route of meja
app.use(userRoute)

// register route of meja
app.use(transaksiRoute)

// register route of meja
app.use(authRoute)

app.use(express.static(__dirname))

app.listen(PORT, () => {
    console.log(`Server run on port ${PORT}`)
})