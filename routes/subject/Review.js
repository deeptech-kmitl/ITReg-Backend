const express = require("express");
const { auth } = require("firebase-admin");
const { admin } = require("../../Firebase/FirebaseConfig.js")
const { db } = require('../../Firebase/FirebaseConfig.js');
router = express.Router();

router.post('/newReview', async (req, res) => {
    try {
        const { subjectId, userId, content ,rating,grade} = req.body;

        // Save review to Firestore
        const reviewRef = await db.collection(`subjects/${subjectId}/reviews`).add({
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
router.put('/editReview', async (req, res) => {
    try {
        const { subjectId, userId, content ,rating,grade,reviewId} = req.body;

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

router.delete('/delReview', async (req, res) => {
    try {
        const { subjectId,reviewId} = req.body;

        // Update review to Firestore
        const reviewRef = await db.collection(`subjects/${subjectId}/reviews/`).doc(reviewId).delete();
        res.status(201).json({ message: reviewRef.id });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

exports.router = router;