const express = require("express");
const { auth } = require("firebase-admin");
const { admin }  = require("../../Firebase/FirebaseConfig")
const { isLoggedIn } = require("../../middlewares/index")
router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userRecord = await admin.auth().createUser({
            email,
            password,
        })

        res.status(201).json({ uid: userRecord.uid, email: userRecord.email });
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


exports.router = router;