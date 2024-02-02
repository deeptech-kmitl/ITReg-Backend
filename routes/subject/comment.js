const express = require("express");
const { auth } = require("firebase-admin");
const { admin } = require("../../Firebase/FirebaseConfig.js")
const { db } = require('../../Firebase/FirebaseConfig.js');
router = express.Router();
router.get('/getComments/:subjectId/:questionId', async (req, res) => {
    try {
        const tempDoc = []
        const comment = db.collection(`subjects/${req.params.subjectId}/questions/${req.params.questionId}/comments`)
        comment.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                tempDoc.push({ id: doc.id, ...doc.data() })
            })
            res.status(201).json(tempDoc);
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
router.post('/comment', async (req, res) => {
    try {
        const { subjectId, questionId, details, userId } = req.body;
        // Save comment to Firestore
        const commentRef = await db.collection(`subjects/${subjectId}/questions/${questionId}/comments`).add({
            details,
            userId,
            time: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Return the ID of the newly created comment
        res.status(201).json({ message: commentRef.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



exports.router = router;