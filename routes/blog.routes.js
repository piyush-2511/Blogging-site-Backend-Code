const {Router} = require('express');
const router = Router();
const multer = require('multer');
const path = require('path')
const Blog = require('../models/blog.model.js')
const Comment = require('../models/comment.model.js')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`))
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName)
  }
})

const upload = multer({storage: storage})

router.get('/add-new', (req, res) => {
  return res.render('addBlog', {
    user : req.user
  });
});

router.post('/',upload.single('coverImage'),async (req,res)=>{
  const {title, body, coverImageURL} = req.body
  const blog = await Blog.create({
    title,
    body,
    coverImageURL : `/uploads/${req.file.filename}`,
    createdBy : req.user._id
  })
  return res.redirect(`/blog/${blog._id}`)
})

router.get('/:blogId', async (req, res) => {
  const blogId = req.params.blogId

  const blog = await Blog.findById(blogId).populate('createdBy')
  const comments = await Comment.find({blogId}).populate('createdBy')

  console.log(comments)
  return res.render('blog', {
    user : req.user,
    blog : blog,
    comments : comments
  })
})

router.post('/comment/:blogId',async (req,res)=>{
  await Comment.create({
    content : req.body.content,
    blogId : req.params.blogId,
    createdBy : req.user._id
  })

  return res.redirect(`/blog/${req.params.blogId}`)
})


module.exports = router