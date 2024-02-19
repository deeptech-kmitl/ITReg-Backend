const express = require("express");
const { auth } = require("firebase-admin");
const { admin } = require("../../Firebase/FirebaseConfig.js")
const { db } = require('../../Firebase/FirebaseConfig.js');
router = express.Router();
//// Subjects
router.get('/getAllSubjects', async (req, res) => {
    const dataIt = require("../../subjectIT.json")
    const dataBit = require("../../subjectBit.json")
    const dataDsba = require("../../subjectDsba.json")
    const dataSec = require("../../subjectSelection.json")
    const dataIt2565 = require("../../subject/2565/subjectIT.json")
    const dataDsba2565 = require("../../subject/2565/subjectDsba.json")
    const dataBit2565 = require("../../subject/2565/subjectBit.json")
    const dataGened = require("../../subject/2565/subjectGened.json")
    const data = dataIt.concat(dataBit).concat(dataDsba).concat(dataSec).concat(dataIt2565).concat(dataDsba2565).concat(dataBit2565).concat(dataGened)
    const filteredData = data.filter(item => /^\d+$/.test(item.subjectId));
    const unique = filteredData.filter((obj, index) => {
        return index === filteredData.findIndex(o => obj.subjectId === o.subjectId);
    });
    res.status(201).json(unique);
    // try {
    //     const tempDoc = []
    //     const subjectsRef = db.collection('subjects')
    //     subjectsRef.get().then((querySnapshot) => {
    //         querySnapshot.forEach((doc) => {
    //             tempDoc.push({ id: doc.id, ...doc.data() })
    //         })
    //         res.status(201).json(tempDoc);
    //     })
    // }
    // catch (error) {
    //     res.status(500).json({ error: 'Internal Server Error' });
    // }
});
router.get('/getSubjects/:subjectId', async (req, res) => {
    const subjectsRef = db.collection('subjects/14jMRogrxlCCUOqtOwHv').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is the data of the document
            console.log(doc.id, ' => ', doc.data());
        });
        res.status(201).json({ message: 'Show Subjects Success' });
    })
        .catch((error) => {
            res.status(500).json({ error: 'Internal Server Error' });
        });
})

router.post('/addSubject', async (req, res) => {

    try {
        const data = require("../../testSubject.json")
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
router.post('/addASubject', async (req, res) => {

    try {
        console.log("asd")
        const subjectRef = await db.collection('subjects').doc("90401011").set({})

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