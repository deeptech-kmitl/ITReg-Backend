const express = require("express");
const { auth } = require("firebase-admin");
const { admin } = require("../../Firebase/FirebaseConfig.js")
const { db } = require('../../Firebase/FirebaseConfig.js');
router = express.Router();

router.get('/getStudyPlan/:year', async (req, res) => {

    const courseYear = req.params.year;
    const {
        year,
        term,
        coop,
        course,
        yearStudy,
    } = req.query;
    console.log("Course year: " + courseYear)
    console.log({
        year,
        term,
        coop,
        course,
        yearStudy
    })

    const courseDataMap = {
        '2560': {
            'it': "../../subjectIT.json",
            'dsba': "../../subjectDsba.json",
            'bit': "../../subjectBit.json"
        },
        '2565': {
            'it': "../../subject/2565/subjectIT.json",
            'dsba': "../../subject/2565/subjectDsba.json",
            'bit': "../../subject/2565/subjectBit.json"
        }
    };

    try {

        const path = courseDataMap[courseYear][course];
        console.log(`${course} ${courseYear}`);
        const data = require(path);
        const filterSubjects = data.filter(item => {

            if (courseYear === '2565') {
                console.log('2565')
                return item.semeter === parseInt(term) &&
                    item.year === parseInt(yearStudy)
            } else {
                console.log('2560')
                return item.semeter === parseInt(term) &&
                    item.year === parseInt(yearStudy) &&
                    item.cooperativeEducation === (coop === 'coop');
            }

        });
        // console.log(filterSubjects);

        res.status(201).json(filterSubjects);

    } catch (error) {
        console.error('Error get subjects:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


exports.router = router;