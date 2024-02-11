const express = require("express");
const { auth } = require("firebase-admin");
const { admin } = require("../../Firebase/FirebaseConfig.js");
const { db, bucket } = require('../../Firebase/FirebaseConfig.js');
const multer = require('multer');

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/newPost', upload.single('image'), async (req, res) => {
    try {
        const { Title, createBy, description } = req.body;

        // Save post to Firestore
        const newPost = await db.collection(`post`).add({
            Time: admin.firestore.FieldValue.serverTimestamp(),
            Title,
            createBy,
            description,
        });

        // Upload image to Firebase Storage
        if (req.file) {
            const imageBuffer = req.file.buffer;
            const fileName = `images/${newPost.id}.jpg`; // Change the extension as needed

            const file = bucket.file(fileName);
            await file.save(imageBuffer, {
                metadata: {
                    contentType: 'image/jpeg', // Change the content type based on your file type
                },
            });
        }

        res.status(201).json({ message: newPost.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE route to delete a post
router.delete('/deletePost/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;

        // Delete post from Firestore
        await db.collection('post').doc(postId).delete();

        // Delete corresponding image from Firebase Storage
        const fileName = `images/${postId}.jpg`; // Change the extension as needed
        const file = bucket.file(fileName);
        await file.delete();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT route to edit/update a post
router.put('/editPost/:postId', upload.single('image'), async (req, res) => {
    try {
        const postId = req.params.postId;
        const { Title, createBy, description } = req.body;

        // Update post in Firestore
        await db.collection('post').doc(postId).update({
            Title,
            createBy,
            description,
        });

        // Upload new image to Firebase Storage (if a new image is provided)
        if (req.file) {
            const imageBuffer = req.file.buffer;
            const fileName = `images/${postId}.jpg`; // Change the extension as needed

            const file = bucket.file(fileName);
            await file.save(imageBuffer, {
                metadata: {
                    contentType: 'image/jpeg', // Change the content type based on your file type
                },
            });
        }

        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

exports.router = router;
