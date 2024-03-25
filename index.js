const express = require('express');
const { getStorage, getDownloadURL } = require('firebase-admin/storage');
const cors = require('cors');

const app = express();
const port = 3000; // Set your desired port number

const { db } = require('./Firebase/FirebaseConfig.js');
const { bucket } = require('./Firebase/FirebaseConfig.js');

app.use(cors());
app.use(express.json());



// Define routes (assuming these are your API endpoints)
const authenticationRouter = require('./routes/user/Authentication.js');
const subject = require('./routes/subject/subject.js');
const question = require('./routes/subject/question.js');
const answer = require('./routes/subject/answer.js');
const post = require('./routes/post/post.js');
const review = require('./routes/subject/Review.js');
const studyPlan = require('./routes/subject/studyPlan.js');

app.use('/api', authenticationRouter.router);
app.use('/api', subject.router);
app.use('/api', question.router);
app.use('/api', answer.router);
app.use('/api', post.router);
app.use('/api', review.router);
app.use('/api', studyPlan.router);

// Define a simple route for testing
app.get('/', (req, res) => {
  res.send('Hello, this is your backend!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
