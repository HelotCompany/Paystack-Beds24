const firebase = require('firebase');
const configEnv = require('./config.js');

let config = {
  apiKey: configEnv.apiKey,
  authDomain: configEnv.authDomain,
  projectId: configEnv.projectId,
  storageBucket: configEnv.storageBucket,
  messagingSenderId: configEnv.messagingSenderId,
  appId: configEnv.appId,
  measurementId: configEnv.measurementId
};

firebase.initializeApp(config)

module.exports = {
  db: firebase.firestore(),
}