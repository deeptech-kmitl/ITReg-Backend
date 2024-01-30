const express = require("express");
const { auth } = require("firebase-admin");
const { admin } = require("../../Firebase/FirebaseConfig")
const { db } = require('../../Firebase/FirebaseConfig.js');
router = express.Router();
router.get('/getAllSubjects', async (req, res) => {

        const subjectsRef = db.collection('subjects');
        const subject = await subjectsRef.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is the data of the document
              console.log(doc.id, ' => ', doc.data());
            });
            res.status(201).json({ message: 'Add Subjects Success' });
          })
          .catch((error) => {
            res.status(500).json({ error: 'Internal Server Error' });
          });
    
});
router.post('/addSubject', async (req, res) => {

    try {
        const data = require("../../subject.json")
        data.forEach(async i => {
            console.log(i)
            const subjectRef = await db.collection('subjects').add(i)
        })
        res.status(201).json({ message: 'Add Subjects Success' });
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.delete('/removeAllSubject', async (req, res) => {

    const subjectsRef = await db.collection('subjects');
    // Delete all documents in the collection
    subjectsRef.listDocuments().then((documents) => {
        documents.forEach((document) => {
            document.delete();
        });
        res.status(201).json({ message: 'Remove All Subjects Success' });
    }).catch((error) => {
        res.status(500).json({ error: 'Internal Server Error' });
    });
});


exports.router = router;