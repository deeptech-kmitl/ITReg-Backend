const express = require("express");
const { auth } = require("firebase-admin");
const { admin } = require("../../Firebase/FirebaseConfig.js")
const { db } = require('../../Firebase/FirebaseConfig.js');
router = express.Router();
router.post('/newPost', async (req, res) => {
    try {
        const { Title, createBy, description } = req.body;
    
        // Save post to Firestore
        const newPost = await db.collection(`post`).add({
            Time: admin.firestore.FieldValue.serverTimestamp(),
            Title,
            createBy,
            description,
        });
        res.status(201).json({ message: newPost.id });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



exports.router = router;


