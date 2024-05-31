const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
// /tmp is a Vercel directory we can use to upload files to be uploaded to aws
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

/* 
on Vercel every endpoint will be a seperate function run on aws lambda
so instead of connecting to the db here, connect instead every endpoint
mongoose.connect(process.env.MONGO_URL);
*/

/*
will need the aws-sdk
yarn add @aws-sdk/client-s3

path is the location of the file after uploaded to Vercel tmp directory
uploading the file from Vercel to aws
*/
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
  // don't think we need to connect to the database for this
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

/*
need to upload to aws with s3 client instead of local with multer

path is the path for the file after it has been uploaded to the Vercel (should be in tmp directory)
  note: it is renamed and does not include extention
originalname is used to get the extension
mimetype is the file type (e.g. image/jpeg)

instead of using multer to upload the files to our local machine
  and then taking the new path to where multer saved
  and saving that path in the database

  use multer to upload the file to the "local" Vercel host
    (Vercel is a remote host, but since that is where the app is running, it's local to where it's running)
    then we use the Vercel file path to upload that file from Vercel to AWS
    then save the path the the file on AWS in the Database
*/
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

/*
need to upload to s3 instead of uploads
*/
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
