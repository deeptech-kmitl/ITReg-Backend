const express = require("express");
const { auth } = require("firebase-admin");
const { admin } = require("../../Firebase/FirebaseConfig.js")
const { db } = require('../../Firebase/FirebaseConfig.js');
router = express.Router();

router.get('/getReview/:subjectId', async (req, res) => {
    try {
        tempDoc = []
        const subjectId = req.params.subjectId
        const reviewRef = await db.collection(`subjects/${subjectId}/reviews`)
        reviewRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                tempDoc.push({ id: doc.id, ...doc.data() })
            })
            res.status(201).json(tempDoc);
        })
    } catch (error) {
        res.status(500).json({ error: error });
    }
});
router.post('/newReview', async (req, res) => {
    try {
        const { subjectId, userId, content ,rating,grade, like,dislike} = req.body;
        // Save review to Firestore
        const reviewRef = await db.collection(`subjects/${subjectId}/reviews`).add({
            userId,
            time:  admin.firestore.FieldValue.serverTimestamp(),
            subjectId,
            content,
            rating,
            grade,
            like,
            dislike
        });
        res.status(201).json({ message: reviewRef });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.put('/editReview', async (req, res) => {
    try {
        const { subjectId, userId, content ,rating,grade,reviewId} = req.body;
        console.log(req.body)
        // Update review to Firestore
        const reviewRef = await db.collection(`subjects/${subjectId}/reviews/`).doc(reviewId).update({
            userId,
            time:  admin.firestore.FieldValue.serverTimestamp(),
            subjectId,
            content,
            rating,
            grade,
        });
        res.status(201).json({ message: reviewRef.id });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/editReviewLikes', async (req, res) => {
    try {
        const { subjectId, userId,likeType,reviewId} = req.body;
        console.log(req.body)
        if(likeType == "like"){
            await db.collection(`subjects/${subjectId}/reviews/`).doc(reviewId).update({
                like:  admin.firestore.FieldValue.arrayUnion(userId) 
            });
        }else{
            await db.collection(`subjects/${subjectId}/reviews/`).doc(reviewId).update({
            dislike: admin.firestore.FieldValue.arrayUnion(userId) 
        });
        }
        // Update review to Firestore
        res.status(201).json({ message: "seccess"});
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/delReviewLikes', async (req, res) => {
    try {
        const { subjectId, userId,likeType,reviewId} = req.body;
        console.log(req.body)
        if(likeType == "like"){
            await db.collection(`subjects/${subjectId}/reviews/`).doc(reviewId).update({
                like:  admin.firestore.FieldValue.arrayRemove(userId) 
            });
        }else{
            await db.collection(`subjects/${subjectId}/reviews/`).doc(reviewId).update({
            dislike: admin.firestore.FieldValue.arrayRemove(userId) 
        });
        }
        // Update review to Firestore
        res.status(201).json({ message: "seccess"});
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/delReview', async (req, res) => {
    try {
        const {subjectId,reviewId} = req.body;
        console.log(req)
        // Update review to Firestore
        const reviewRef = await db.collection(`subjects/${subjectId}/reviews/`).doc(reviewId).delete();
        res.status(201).json({ message: "success" });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


exports.router = router;