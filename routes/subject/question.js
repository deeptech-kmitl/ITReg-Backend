const express = require("express");
const { auth } = require("firebase-admin");
const { admin } = require("../../Firebase/FirebaseConfig.js")
const { db } = require('../../Firebase/FirebaseConfig.js');
router = express.Router();

router.get('/getQuestions/:subjectId', async (req, res) => {
    const tempDoc = [];

    try {
        const question = db.collection(`subjects/${req.params.subjectId}/questions`);
        question.orderBy("time", "desc").get().then((queryQuestion) => {
            const promises = [];
            queryQuestion.forEach((doc) => {
                let answers = db.collection(`subjects/${req.params.subjectId}/questions/${doc.id}/answers`);
                const promise = answers.orderBy("time", "desc").get().then((queryAnswer) => {
                    let tempAnswer = [];
                    queryAnswer.forEach((docAnswer) => {
                        tempAnswer.push({ id: docAnswer.id, ...docAnswer.data() });
                    });
                    tempDoc.push({ id: doc.id, answers: tempAnswer, ...doc.data() });
                });
                promises.push(promise);
            });
            Promise.all(promises).then(() => {
                res.status(201).json(tempDoc);
            });
        });
    } catch (error) {
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
        const newQuestionRef = await db.collection(`subjects/${subjectId}/questions`).doc(questionRef.id).get()
        const newQuestionData = newQuestionRef.data()
        res.status(201).json({ id: newQuestionRef.id, answers: [], ...newQuestionData });
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
            edit: true,
            time: admin.firestore.FieldValue.serverTimestamp(),
            userId
        })
        const newQuestionRef = await db.collection(`subjects/${subjectId}/questions`).doc(questionId).get()
        const newQuestionData = newQuestionRef.data()
        res.status(201).json({ id: newQuestionRef.id, ...newQuestionData });
        // res.status(200).json({ message: questionRef });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.patch('/likeQuestion', async (req, res) => {
    try {
        const { subjectId, userId, likeType, questionId } = req.body;
        console.log(req.body)
        if (likeType) {
            await db.collection(`subjects/${subjectId}/questions/`).doc(questionId).update({
                like: admin.firestore.FieldValue.arrayRemove(userId)
            });
        } else {
            await db.collection(`subjects/${subjectId}/questions/`).doc(questionId).update({
                like: admin.firestore.FieldValue.arrayUnion(userId)
            });
            await db.collection(`subjects/${subjectId}/questions/`).doc(questionId).update({
                dislike: admin.firestore.FieldValue.arrayRemove(userId)
            });
        }
        // Update review to Firestore
        res.status(201).json({ message: "seccess" });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
router.patch('/dislikeQuestion', async (req, res) => {
    try {
        const { subjectId, userId, likeType, questionId } = req.body;
        console.log(req.body)
        if (likeType) {
            await db.collection(`subjects/${subjectId}/questions/`).doc(questionId).update({
                dislike: admin.firestore.FieldValue.arrayRemove(userId)
            });
        } else {
            await db.collection(`subjects/${subjectId}/questions/`).doc(questionId).update({
                dislike: admin.firestore.FieldValue.arrayUnion(userId)
            });
            await db.collection(`subjects/${subjectId}/questions/`).doc(questionId).update({
                like: admin.firestore.FieldValue.arrayRemove(userId)
            });
        }
        // Update review to Firestore
        res.status(201).json({ message: "seccess" });
    } catch (error) {
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