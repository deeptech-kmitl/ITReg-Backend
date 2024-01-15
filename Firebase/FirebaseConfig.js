const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
var admin = require("firebase-admin");

var serviceAccount = require("./key.json");
admin.initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "itreg-backend.appspot.com"
});

const bucket = getStorage().bucket("itreg-backend.appspot.com");
const db = getFirestore();
module.exports = { db, bucket, admin };