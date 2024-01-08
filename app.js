const express = require('express');
const app = express();
const port = 3001; // Set your desired port number

app.get('/', (req, res) => {
    res.send('Hello, this is your backend!');
  });

app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});
  