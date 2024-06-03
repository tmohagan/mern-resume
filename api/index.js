const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: '/tmp' });
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const fs = require('fs');

require('dotenv').config();
const app = express();

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';
const bucket = 'ohagan-mern-blog';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

async function uploadToS3(path, originalFilename, mimetype) {
  const client = new S3Client({
    region: 'us-east-2',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  const parts = originalFilename.split('.');
  const ext = parts[parts.length -1];
  const newFilename = Date.now() + '.' + ext;
  const data = await client.send(new PutObjectCommand({
    Bucket: bucket,
    Body: fs.readFileSync(path),
    Key: newFilename,
    ContentType: mimetype,
    ACL: 'public-read',
  }));
  return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}

app.get('/test', (req,res) => {
  res.json('ok');
}
);

app.post('/register', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {username,password} = req.body;
  try{
    const userDoc = await User.create({
      username,
      password:bcrypt.hashSync(password,salt),
    });
    res.json(userDoc);
  } catch(e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post('/login', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {username,password} = req.body;
  const userDoc = await User.findOne({username});
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id:userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});

app.get('/profile', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err,info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post('/logout', (req,res) => {
  res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {originalname, path, mimetype} = req.file;
  const imageUrl = await uploadToS3(path, originalname, mimetype);

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {title,summary,content} = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover:imageUrl,
      author:info.id,
    });
    res.json(postDoc);
  });
});

app.put('/post',uploadMiddleware.single('file'), async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  let imageUrl = null;
  if (req.file) {
    const {originalname, path, mimetype} = req.file;
    imageUrl = await uploadToS3(path, originalname, mimetype);
  }

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {id,title,summary,content} = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: imageUrl ? imageUrl : postDoc.cover,
    });

    res.json(postDoc);
  });

});

app.get('/post', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({createdAt: -1})
      .limit(20)
  );
});

app.get('/post/:id', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})

if (process.env.API_PORT) {
  app.listen(process.env.API_PORT);
}

module.exports = app;
