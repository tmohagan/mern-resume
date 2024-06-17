const express = require('express');
const cors = require('cors');
// ... (other imports)
const {DeleteObjectCommand} = require('@aws-sdk/client-s3'); // Import for S3 delete

// ... (other code, setup)

// ... (other API routes)

app.delete('/post/:id', async (req, res) => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    const { id } = req.params;

    const postDoc = await Post.findById(id);
    if (!postDoc) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }

      if (!postDoc.author.equals(info.id)) {
        return res.status(403).json({ error: 'Unauthorized to delete this post' });
      }

      // 4. Extract the image filename from the S3 URL
      if (postDoc.cover) {
        const imageUrlParts = postDoc.cover.split('/');
        const imageName = imageUrlParts[imageUrlParts.length - 1];

        // 5. Delete the image from S3
        const client = new S3Client({
          region: 'us-east-2',
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
          },
        });
        await client.send(new DeleteObjectCommand({
          Bucket: bucket,
          Key: imageName,
        }));
      }

      // 6. Delete the post from MongoDB (this is already in your code)
      await Post.findByIdAndDelete(id); 

      res.json({ success: true });
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ... (rest of your code)
