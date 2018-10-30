`use strict`
const crypto = require('crypto');
var randomstring = require("randomstring");

var password = "password@123";
var saltValue = randomstring.generate();

// register
const key1 = crypto.pbkdf2Sync(password, saltValue, 100000, 64, 'sha512');
console.log(key1.toString('hex'));  
const key12 = crypto.pbkdf2Sync(key1.toString('hex'), saltValue, 100000, 64, 'sha512');
console.log(key12.toString('hex'));  

// login
const key13 = crypto.pbkdf2Sync(key1.toString('hex'), saltValue, 100000, 64, 'sha512');
console.log(key13.toString('hex'));  
console.log(key12.toString('hex') === key13.toString('hex'));
console.log("--------------");

/*
register
password & confirm password  -> password1234
hash 2 twice  password1234 -> xyz (frontend) -> abc (backend)
abc generate -> frontend_salt (fix) backend_salt (randomize)
store the abc and two salts into the database


login
password is entered by the user -> password1234
send the frontend salt to the angular
hash password1234 -> xyz -> abc

use abc compare the database abc
*/
/*
var saltValue2 = randomstring.generate();

const key2 = crypto.pbkdf2Sync(password, saltValue2, 100000, 64, 'sha512');
console.log(key2.toString('hex'));  
const key22 = crypto.pbkdf2Sync(key2.toString('hex'), saltValue2, 100000, 64, 'sha512');
console.log(key22.toString('hex'));  */


//console.log(key.toString('hex') === key2.toString('hex'));
//ba0c744e82e31256af21fe8d85143d632753948cddb970d0ffb1c4771efd1b40a939a48535256153ae3cd909fe8538604a72c69c234147357afeafa0d881cf3f