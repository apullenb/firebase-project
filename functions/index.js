const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const express = require('express');
const app = express();

app.get('/posts', (req, res) => {
admin
 .firestore()
.collection("posts")
.get()
.then((data) => {
  const posts = [];
  data.forEach((doc) => {
    posts.push(doc.data());
  });
  return res.json(posts);
})
.catch((err) => console.error(err));
});


exports.getPosts = functions.https.onRequest((req, res) => {
  admin
      .firestore()
      .collection("posts")
      .get()
      .then((data) => {
        const posts = [];
        data.forEach((doc) => {
          posts.push(doc.data());
        });
        return res.json(posts);
      })
      .catch((err) => console.error(err));
});

exports.createPost = functions.https.onRequest((req, res) => {
    if (req.method !== 'POST') {
        return res.status(400).json({error: 'Method Not Allowed'})
    }
  const newPost = {
    body: req.body.body,
    userId: req.body.userId,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  };

  admin.firestore()
      .collection("posts")
      .add(newPost)
      .then((doc) => {
        res.json({message: `document ${doc.id} created successfully`});
      })
      .catch((err) => {
        res.status(500).json({error: "something went wrong"});
        console.error(err);
      });
});

exports.api = functions.https.onRequest(app);