require('dotenv').config()
const Koa = require('koa')
const router = require('./route')
const checkToken = require('./middleware/token')

const app = new Koa()


// app.use(checkToken())
app.use(router.routes())

app.listen(10001, () => {
  console.log('server running')
})
