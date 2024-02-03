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

//Edit 
router.put('/comment', async (req, res) => {
    try {
        const { subjectId, userId, details, questionId, commentId } = req.body;

        const questionRef = await db.collection(`subjects/${subjectId}/questions/${questionId}/comments`).doc(commentId).update({ 
            details,
            time:  admin.firestore.FieldValue.serverTimestamp(),
            userId
        })

        res.status(200).json({ message: questionRef.id });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Delete
router.delete('/comment', async (req, res) => {
    try {
        const { subjectId ,questionId, commentId } = req.body;
        const questionRef = await db.collection(`subjects/${subjectId}/questions/${questionId}/comments`).doc(commentId).delete()
        res.status(200).json({ message: `Delete ${questionRef.id} Sucess` });
    } catch (error) {

        res.status(500).json({ error: 'Internal Server Error' });
    }
});



exports.router = router;