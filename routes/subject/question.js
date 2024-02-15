const express = require("express");
const { auth } = require("firebase-admin");
const { admin } = require("../../Firebase/FirebaseConfig.js")
const { db } = require('../../Firebase/FirebaseConfig.js');
router = express.Router();

router.get('/getQuestions/:subjectId', async (req, res) => {
    try {
        const tempDoc = []
        const question = db.collection(`subjects/${req.params.subjectId}/questions`)
        question.orderBy("time", "desc").get().then((queryQuestion) => {
            queryQuestion.forEach((doc) => {
                const tempAnswer = []
                let comment = db.collection(`subjects/${req.params.subjectId}/questions/${doc.id}/answers`)
                comment.orderBy("time", "desc").get().then((queryAnswer) => {
                    queryAnswer.forEach((doc) => {
                        tempAnswer.push({ id: doc.id, ...doc.data() })
                    })
                })
                tempDoc.push({ id: doc.id, answer: tempAnswer, ...doc.data() })
            })
            res.status(201).json(tempDoc);
        })
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
///// Questions
router.post('/question', async (req, res) => {
    try {
        const { subjectId, userId, detail } = req.body;

        // Save comment to Firestore
        const questionRef = await db.collection(`subjects/${subjectId}/questions`).add({
            detail,
            userId,
            like: [],
            dislike: [],
            time: admin.firestore.FieldValue.serverTimestamp(),
        });
        res.status(201).json({ message: questionRef.id });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Edit 
router.put('/question', async (req, res) => {
    console.log(req.body)
    try {
        const { subjectId, userId, detail, questionId } = req.body;

        const questionRef = await db.collection(`subjects/${subjectId}/questions/`).doc(questionId).update({
            detail,
            time: admin.firestore.FieldValue.serverTimestamp(),
            userId
        })

        res.status(200).json({ message: questionRef.id });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Delete
router.delete('/question', async (req, res) => {
    console.log(req.body)
    try {
        const { subjectId, questionId } = req.body;
        const questionRef = await db.collection(`subjects/${subjectId}/questions`).doc(questionId).delete()
        res.status(200).json({ message: `Delete ${questionRef.id} Sucess` });
    } catch (error) {

        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//// Comments


exports.router = router;