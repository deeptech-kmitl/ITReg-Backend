const { admin, db } = require("../Firebase/FirebaseConfig");

const isLoggedIn = async (req, res, next) => {
    const token = req.headers.authorization;
    if(!token){
        console.log(token);
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
}
module.exports = { isLoggedIn };