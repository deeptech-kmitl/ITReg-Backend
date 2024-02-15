const express = require("express");
const { auth } = require("firebase-admin");
const { admin } = require("../../Firebase/FirebaseConfig.js");
const { db, bucket } = require('../../Firebase/FirebaseConfig.js');
const multer = require('multer');
const { getDownloadURL } = require("firebase-admin/storage");

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/post', async (req, res) => {
    try {
        const tempDoc = [];
        const postRef = db.collection(`post`);
        postRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                tempDoc.push({ id: doc.id, ...doc.data() })
            })
            res.status(201).json(tempDoc);
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post('/newPost', upload.array('images'), async (req, res) => {
    try {
        const Post = req.body.Post;
        const images = req.files;

        const uploadedImageUrls = [];

        if (images){
            for (const image of images) {
                if (image) {
                    const imageBuffer = image.buffer;
                    const fileName = `images/${image.fieldname + Math.random().toString(16).slice(2)}.jpg`; // Change the extension as needed
    
                    const file = bucket.file(fileName);
                    await file.save(imageBuffer, {
                        metadata: {
                            contentType: 'image/jpeg', // Change the content type based on your file type
                        },
                    });
    
                    //get url when i upload
                    const downloadURL = await getDownloadURL(file);
                    uploadedImageUrls.push(downloadURL);
                }
            }
        }
        const data_post = {
            id: req.body.id,
            titlename: req.body.titlename,
            name: req.body.name,
            date: req.body.date,
            time: req.body.time,
            message: req.body.message,
            image: uploadedImageUrls || [],
            like: [],
            comment: []
        };

        const newPost = await db.collection(`post`).add(
            data_post
        );
        res.status(201).json(data_post);
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

router.put('/newPostLikes', async (req, res) => {
    try {
        const { postId, userId,} = req.body;
        console.log(req.body)
            await db.collection(`post`).doc(postId).update({
                like:  admin.firestore.FieldValue.arrayUnion(userId) 
            });
        // Update review to Firestore
        res.status(201).json({ message: "seccess"});
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/delPostLikes', async (req, res) => {
    try {
        const { postId, userId,} = req.body;
        console.log(req.body)
            await db.collection(`post`).doc(postId).update({
                like:  admin.firestore.FieldValue.arrayRemove(userId) 
            });
        // Update review to Firestore
        res.status(201).json({ message: "seccess"});
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

exports.router = router;
