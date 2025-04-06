require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const path = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const {checkForAuthenticationCookie} = require('./middleware/authentication.js')

const Blog = require('./models/blog.model.js')

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
  })

app.set('view engine', 'ejs')
app.set('views', path.resolve("./views"))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.resolve('./public')))
app.use(express.json())
app.use(cookieParser())
app.use(checkForAuthenticationCookie('token'))


const userRoutes = require('./routes/user.routes.js')
const blogRoutes = require('./routes/blog.routes.js')
app.use('/user', userRoutes)
app.use('/blog', blogRoutes)

app.get('/',async (req, res) => {
  const allBlogs = await Blog.find({})
  res.render('home',{
    user : req.user,
    blogs : allBlogs
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})