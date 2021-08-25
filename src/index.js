const express = require('express')
const userRouter = require('./routers/reporter')
const taskRouter = require('./routers/news')



require('./db/mongoose')

const app = express()


app.use(express.json())


app.use(userRouter)
app.use(taskRouter)

const port = 3000


/////////////////////////////////////////////////////////////////////////////////
app.listen(port, () => { console.log('Server is running') })