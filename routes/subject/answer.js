const express = require("express");
const { auth } = require("firebase-admin");
const { admin } = require("../../Firebase/FirebaseConfig.js")
const { db } = require('../../Firebase/FirebaseConfig.js');
router = express.Router();
router.get('/getAnswers/:subjectId/:questionId', async (req, res) => {
    try {
        const tempDoc = []
        const comment = db.collection(`subjects/${req.params.subjectId}/questions/${req.params.questionId}/answers`)
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
router.post('/answer', async (req, res) => {
    try {
        const { subjectId, questionId, detail, userId } = req.body;
        // Save comment to Firestore
        const answerRef = await db.collection(`subjects/${subjectId}/questions/${questionId}/answers`).add({
            detail,
            userId,
            time: admin.firestore.FieldValue.serverTimestamp(),
        });

        const newAnswerRef = await db.collection(`subjects/${subjectId}/questions/${questionId}/answers`).doc(answerRef.id).get()
        const newAnswerData = newAnswerRef.data()
        res.status(201).json({ id: answerRef.id, ...newAnswerData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Edit 
router.put('/answer', async (req, res) => {
    console.log(req.body)
    try {
        const { subjectId, userId, detail, questionId, answerId } = req.body;

        const answerRef = await db.collection(`subjects/${subjectId}/questions/${questionId}/answers`).doc(answerId).update({
            detail,
            time: admin.firestore.FieldValue.serverTimestamp(),
            userId
        })
        const newAnswerRef = await db.collection(`subjects/${subjectId}/questions/${questionId}/answers`).doc(answerId).get()
        const newAnswerData = newAnswerRef.data()
        res.status(201).json({ id: answerId, ...newAnswerData });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Delete
router.delete('/answer', async (req, res) => {
    console.log(req.body)
    try {
        const { subjectId, questionId, answerId } = req.body;
        const questionRef = await db.collection(`subjects/${subjectId}/questions/${questionId}/answers`).doc(answerId).delete()
        res.status(200).json({ message: `Delete ${questionRef.id} Sucess` });
    } catch (error) {

        res.status(500).json({ error: 'Internal Server Error' });
    }
});



exports.router = router;