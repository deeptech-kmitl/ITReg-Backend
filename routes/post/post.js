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
        const postRef = db.collection(`posts`);
        const querySnapshot = await postRef.orderBy("dateTime", "desc").get();

        // Iterate through each post document
        for (const doc of querySnapshot.docs) {
            const postData = { id: doc.id, ...doc.data() };
            // Access the nested collection
            const commentsRef = doc.ref.collection('comment');
            const commentsQuerySnapshot = await commentsRef.orderBy("dateTime", "desc").get();

            // Create an array to store comments data
            const commentsData = [];

            // Iterate through each comment document within the nested collection
            commentsQuerySnapshot.forEach((commentDoc) => {
                commentsData.push({ commentId: commentDoc.id, ...commentDoc.data() });
            });

            // Add the comments data to the post data
            postData.comments = commentsData;

            // Push the structured post data to tempDoc array
            tempDoc.push(postData);
        }

        res.status(201).json(tempDoc);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/newPost', upload.array('images'), async (req, res) => {
    const db = admin.firestore(); // Assuming you have the admin initialized for Firebase
    try {
        const docId = Math.random().toString(16).slice(2)
        const transaction = await db.runTransaction(async (t) => {
            try {
                const Post = req.body.Post;
                const images = req.files;
    
                const uploadedImageUrls = [];
                if (images) {
                    for (const image of images) {
                        if (image) {
                            const imageBuffer = image.buffer;
                            const fileName = `postImage/${docId}/${image.fieldname + Math.random().toString(16).slice(2)}.jpg`; // Change the extension as needed
    
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
    
                    const data_post = {
                        titlename: req.body.titlename,
                        name: req.body.name,
                        message: req.body.message,
                        image: uploadedImageUrls || [],
                        like: [],
                        dateTime: admin.firestore.FieldValue.serverTimestamp()
                    };
    
                    // Create a new post document with a unique ID
                    const newPostRef = db.collection('posts').doc(docId);
    
                    // Use the transaction to create the new post and update other documents if needed
                    t.set(newPostRef, data_post);
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
        const postref = await db.collection('posts').doc(docId).get();
        console.log(postref.data());
        res.status(201).json({ ...postref.data(), id: docId, comments: [] });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// DELETE route to delete a post
router.delete('/deletePost/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;

        // Delete post from Firestore
        await db.collection('posts').doc(postId).delete();

        // Delete files from Google Cloud Storage with a specific prefix
        const prefix = `postImage/${postId}/`;

        await bucket.deleteFiles({
            prefix: prefix,
        });

        console.log(`Files and folder with prefix ${prefix} deleted successfully.`);

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT route to edit/update a post
router.put('/editPost/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const { Title, message } = req.body;
        const postref = await db.collection(`posts`).doc(postId).update({
            titlename: Title,
            message: message,
            dateTime: admin.firestore.FieldValue.serverTimestamp()
        })
        const postDoc = await db.collection(`posts`).doc(postId).get();
        const postData = postDoc.data();
        res.status(200).send({ ...postData, id: postId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/editPostComment/:postId/:commentId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId
        const { detail, userId } = req.body;
        const commentref = await db.collection(`posts/${postId}/comment`).doc(commentId).update({
            userId: userId,
            detail: detail,
            dateTime: admin.firestore.FieldValue.serverTimestamp()
        })
        const commentDoc = await db.collection(`posts/${postId}/comment`).doc(commentId).get();
        const commentData = commentDoc.data();
        res.status(200).send({ ...commentData, commentId: commentId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.patch('/newPostLikes', async (req, res) => {
    try {
        const { postId, userId, } = req.body;
        console.log(req.body)
        await db.collection(`posts`).doc(postId).update({
            like: admin.firestore.FieldValue.arrayUnion(userId)
        });
        // Update review to Firestore
        res.status(201).json({ message: "seccess" });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.patch('/delPostLikes', async (req, res) => {
    try {
        const { postId, userId, } = req.body;
        console.log(req.body)
        await db.collection(`posts`).doc(postId).update({
            like: admin.firestore.FieldValue.arrayRemove(userId)
        });
        // Update review to Firestore
        res.status(201).json({ message: "seccess" });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/newcommentPost', async (req, res) => {
    try {
        const { postId, detail, userId } = req.body;
        // Save comment to Firestore
        const commentRef = await db.collection(`posts/${postId}/comment`).add({
            detail,
            userId,
            dateTime: admin.firestore.FieldValue.serverTimestamp(),
        });

        const commentDoc = await db.collection(`posts/${postId}/comment`).doc(commentRef.id).get();
        const commentData = commentDoc.data();
        commentData.commentId = commentRef.id;
        res.status(201).send(commentData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.delete('/delCommentPost/:postId/:commentId', async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const postId = req.params.postId;
        console.log(postId, commentId)
        const response = await db.collection(`posts/${postId}/comment`).doc(commentId).delete();
        res.status(200).send("delete success")
    } catch (error) {
        res.send(error.message)
    }
})
exports.router = router;
