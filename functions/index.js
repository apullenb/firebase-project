const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require('express')();
const API_KEY = require('./config')


admin.initializeApp();
 const config = {
    apiKey: API_KEY,
    authDomain: "facespace-a1792.firebaseapp.com",
    databaseURL: "https://facespace-a1792-default-rtdb.firebaseio.com",
    projectId: "facespace-a1792",
    storageBucket: "facespace-a1792.appspot.com",
    messagingSenderId: "459362051788",
    appId: "1:459362051788:web:6916b0551c91d5f6c80469"
  };

  const firebase = require('firebase')
  firebase.initializeApp(config)

  // Signup Route
  app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    }

    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
        return res.status(201).json({message: `user ${data.user.uid} signed up successfully!` })
    })
    .catch(err => {
        console.error(err)
        return res.status(500).json({error: err.code})
    })

  })

app.get('/posts', (req, res) => {
admin
 .firestore()
.collection("posts")
.orderBy('createdAt', 'desc')
.get()
.then((data) => {
  const posts = [];
  data.forEach((doc) => {
    posts.push({
        postID: doc.id,
        body: doc.data().body,
        userId: doc.data().userId,
        createdAt: doc.data().createdAt
    });
  });
  return res.json(posts);
})
.catch((err) => console.error(err));
});



app.post('/posts', (req, res) => {
    if (req.method !== 'POST') {
        return res.status(400).json({error: 'Method Not Allowed'})
    }
  const newPost = {
    body: req.body.body,
    userId: req.body.userId,
    createdAt: new Date().toISOString()
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