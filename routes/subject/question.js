const express = require("express");
const { auth } = require("firebase-admin");
const { admin } = require("../../Firebase/FirebaseConfig.js")
const { db } = require('../../Firebase/FirebaseConfig.js');
router = express.Router();

router.get('/getQuestions/:subjectId', async (req, res) => {
    try {
        const tempDoc = []
        const question = db.collection(`subjects/${req.params.subjectId}/questions`)
        question.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                tempDoc.push({ id: doc.id, ...doc.data() })
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
        const { subjectId, userId, details } = req.body;

        // Save comment to Firestore
        const questionRef = await db.collection(`subjects/${subjectId}/questions`).add({
            details,
            userId,
            time: admin.firestore.FieldValue.serverTimestamp(),
        });
        res.status(201).json({ message: questionRef.id });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.put('/question', async (req, res) => {
    try {
        const { subjectId, userId, content } = req.body;

        res.status(201).json({ message: "Add Question Sucess" });
    } catch (error) {

        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.delete('/question', async (req, res) => {
    try {
        const { subjectId, userId, content } = req.body;
        res.status(201).json({ message: "Add Question Sucess" });
    } catch (error) {

        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//// Comments


exports.router = router;