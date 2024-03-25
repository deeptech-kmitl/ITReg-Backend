const express = require('express');
const { getStorage, getDownloadURL } = require('firebase-admin/storage');
const cors = require("cors");

const app = express();
const port = 3000; // Set your desired port number

const { db } = require('./Firebase/FirebaseConfig.js');
const {bucket} = require('./Firebase/FirebaseConfig.js');

app.use(cors());
app.use(express.json());


const whitelist = [
  '*'
];

app.use((req, res, next) => {
  const origin = req.get('referer');
  const isWhitelisted = whitelist.find((w) => origin && origin.includes(w));
  if (isWhitelisted) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
  }
  // Pass to next layer of middleware
  if (req.method === 'OPTIONS') res.sendStatus(200);
  else next();
});

const setContext = (req, res, next) => {
  if (!req.context) req.context = {};
  next();
};
app.use(setContext);


//router
const authenticationRouter = require('./routes/user/Authentication.js');
const subject = require("./routes/subject/subject.js")
const question = require("./routes/subject/question.js")
const answer = require("./routes/subject/answer.js")
const post = require("./routes/post/post.js")
const review = require("./routes/subject/Review.js")
const studyPlan = require("./routes/subject/studyPlan.js")
app.use("/api", authenticationRouter.router);
app.use("/api", subject.router)
app.use("/api", question.router)
app.use("/api", answer.router)
app.use("/api", post.router)
app.use("/api", review.router)
app.use("/api", studyPlan.router)
//


app.get('/', (req, res) => {
    res.send('Hello, this is your backend!');
  });

// app.post('/api/create', async (req, res) => {
//   // const { name, email, password } = req.body;
//   const user = { name:"rome" };
//   const userRef = await db.collection('users').add(user);
//   const userDoc = await userRef.get();
//   res.send(userDoc.data());

// });

// app.get('/api/img', async (req, res) => {
//   const fileRef = bucket.file('Python-Imports_Watermarked.ae72c8a00197.jpg');
//   const downloadURL= await getDownloadURL(fileRef);
//   console.log(downloadURL);
//   res.send(downloadURL);
// });



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
  