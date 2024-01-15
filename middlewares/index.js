const { admin } = require("../Firebase/FirebaseConfig");

const isLoggedIn = (req, res, next) => {
    const token = req.header.authorization;

    if(token){
        return res.status(401).json("unauthorize");
    }

    admin.auth().verifyIdToken(token)
        .then(decodetoken => {
            req.user = decodetoken;
            next();
        })
        .catch(err => {
            console.log("verifying token error");
            res.status(401).json("error");
        })

    module.exports = { isLoggedIn };
}