'use strict';
var crypto = require('crypto');

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword, salt) {
    //var salt = genRandomString(16); /** Gives us salt of length 16 */
    console.log('nSalt = '+salt);
    //var passwordData = sha512(userpassword, salt);
    const passwordData = crypto.pbkdf2Sync(userpassword, salt, 100000, 64, 'sha512');
    console.log(passwordData.toString('hex'));  // '3745e48...08d59ae'
    console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('nSalt = '+passwordData.salt);
}

saltHashPassword('MYPASSWORD', 'f6fffd56d977cdfc');
saltHashPassword('MYPASSWORD', 'f6fffd56d977cdfc');