require('dotenv').config();
const express = require('express'),
      path = require('path'),
      admin = require('firebase-admin'),
      { Storage } = require('@google-cloud/storage'),
      bodyParser = require('body-parser'),
      uuidv4 = require('uuid/v4'),
      multer = require("multer"),
      mysql = require("mysql"),
      jwt = require('jsonwebtoken');
      crypto = require('crypto');
      cors = require('cors');

const app = express();

const API_URI = "/api";
app.use(cors());

//set GOOGLE_APPLICATION_CREDENTIALS=/Users/phangty/Projects/paf-day26/onfire.json
// Initialize Firebase
const credFile = process.env.Svc_Cred_File || "./ngx-blog.json";

var serviceAccount = require(credFile);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});

var db = admin.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
db.settings(settings);

var authorsCollection = db.collection('authors');
var articlesCollection = db.collection('articles');
var categoriesCollection = db.collection('categories');


const sqlInsertUser = "INSERT INTO USER (email, password, fullname) VALUES (?, ?, ?)";
const sqlFindUserByEmail = "SELECT * FROM USER WHERE email = ?";

var pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: process.env.DB_CONLIMIT,
    debug: false
});

var makeQuery = (sql, pool)=>{
    console.log(sql);
    
    return  (args)=>{
        let queryPromsie = new Promise((resolve, reject)=>{
            pool.getConnection((err, connection)=>{
                if(err){
                    reject(err);
                    return;
                }
                console.log(args);
                connection.query(sql, args || [], (err, results)=>{
                    connection.release();
                    if(err){
                        reject(err);
                        return;
                    }
                    console.log(">>> "+ results);
                    resolve(results); 
                })
            });
        });
        return queryPromsie;
    }
}

var insertUser = makeQuery(sqlInsertUser, pool);
var findUserByEmail = makeQuery(sqlFindUserByEmail, pool);
//export Google_Application_Credentials
const gStorage = new Storage({
      projectId: process.env.FIREBASE_PROJECT_ID
});

const bucket = gStorage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
const googleMulter = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024 //20MB
    }
})


function convertPasswordToHash(password){
    hash = crypto.createHash('sha256');
    console.log(password);
    hash.update(password);
    return hash.digest('hex');
}

app.post(API_URI + '/register', bodyParser.urlencoded({ extended: true}), bodyParser.json({ limit: "50MB" }), (req, res)=>{
    console.log("Post backend register");
    let registerForm = req.body;
    let registrationObj = {...registerForm};
    console.log(JSON.stringify(registrationObj));
    registrationObj.password = convertPasswordToHash(registrationObj.password);
    insertUser([registrationObj.email, registrationObj.password, registrationObj.fullName]).then((results)=>{
        console.log(results);
        res.status(200).json(results);
    }).catch((error)=>{
        console.log(error);
        res.status(500).json(error);
    });
})

app.post(API_URI + '/login', bodyParser.urlencoded({ extended: true}), bodyParser.json({ limit: "50MB" }), (req, res)=>{
    let user = {...req.body};
    let email = user.email;
    let password = user.password;
    let convertedPassInHash = convertPasswordToHash(password);
    console.log(email);
    findUserByEmail([email]).then((result)=>{
        console.log("????" +  JSON.stringify(result));
        if(result.length > 0){
            console.log(result[0].password === convertedPassInHash);
            console.log(result[0].password == convertedPassInHash);
            console.log(result[0].password);
            console.log(convertedPassInHash);
            
            if(result[0].password === convertedPassInHash){
                console.log("MATCH !");
                let token = jwt.sign({...result[0]}, process.env.JWT_SECRET);
                console.log("JWTToken > " , token);
                res.status(200).json({success: true, token: 'JWT ' + token});
            }else{
                res.status(401).json({success: false, msg: "Authentication failed, wrong password"});
            }
        }else{
            res.status(401).json({success: false, msg: "Authentication failed, email doesn't exist"});
        }
    }).catch((error)=>{
        console.log(error);
        res.status(500).json(error);
    })
    
})

app.post(API_URI + '/changePassword', (req, res)=>{
    res.status(200).json({});
})

app.post(API_URI + '/resetPassword', (req, res)=>{
    res.status(200).json({});
})

/////////////////////////// READ ///////////////////////////////////////////
// GET array of authors
app.get(API_URI + '/authors', (req, res) => {
    authorsCollection
    .get()
    // console.log(authorsCollection)
    .then(snapshot => {
        let authorsArr = [];
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            var returnResult = {
                id: doc.id,
                result: doc.data()
            }
            authorsArr.push(returnResult);       
    });
    res.status(200).json(authorsArr);
   })
   .catch(err => {
     console.log('Error getting documents', err);
     res.status(500).json(err);
  }); 
});

// Search by firstname & lastname
app.get(API_URI + '/author', (req, res) => {
    let firstname = req.query.firstname;
    let lastname = req.query.lastname;
    console.log(firstname, lastname);

    if (typeof(firstname === 'undefined') 
        && typeof(lastname === 'undefined')){
        if (firstname === ''
        && lastname === ''){
        console.log('firstname and lastname are undefined');
        res.status(500).json({error: "firstname and lastname are undefined"});
        }
    }

    authorsCollection
        .where('firstname', '==', firstname)
        .where('lastname', '==', lastname)
    .get()
    .then((result) => {
        let authorData = []
    
        authorData = result.docs.map(value => {
            return value.data();
        });

        res.status(200).json(authorData)
     })
     .catch(err => {
        console.log('Error getting documents', err);
        res.status(500).json(err);
    })
});


/**
 * get author by id.
 */
app.get(API_URI + '/authors/:id', (req, res) => {
    let idValue = req.params.id;
    
    authorsCollection.
        doc(idValue)
    .get()
    .then((result) => {
        console.log(result.data());
        var returnResult = {
            id: idValue,
            firstname : result.data().firstname,
            lastname: result.data().lastname,
            email: result.data().email,
            profile: result.data().profile
        }
        res.status(200).json(returnResult)
     })
     .catch(err => {
        console.log('Error getting documents', err);
        res.status(500).json(err);
    })
});

// GET array of articles by topic
app.get(API_URI + '/articles', (req, res) => {
    articlesCollection
    .get()
    .then(snapshot => {
        // No need to push to an array because we're using map here to create a new array
        let snapshotPromises = snapshot.docs.map(doc => {
            const authorId = doc.data().author;
            let articleData = doc.data();

            if (typeof authorId !== 'undefined') {
                const authorRef = authorsCollection.doc(authorId);
                return authorRef.get().then(authorSnapshot => {
                    articleData.authorName = authorSnapshot.data().firstname + ' ' + authorSnapshot.data().lastname;
                    return articleData;
                });
            } else {
                return articleData;
            }
        });

        Promise.all(snapshotPromises).then(results => {
            console.log(results);
            res.status(200).json(results);
        });
   })
   .catch(err => {
        console.log('Error getting documents', err);
        res.status(500).json(err);
  }); 
});

// GET one article by title
app.get(API_URI + '/article', (req, res) => {
    let title = req.query.title
    console.log(title);
    if (typeof(title === 'undefined')){
        if (title === '' ){
            console.log('title is undefined');
            res.status(500).json({error: "title is undefined"});
        }
    }
    articlesCollection
        .where('title', '==', title)
    .get()
    .then(snapshot => {
        let articlesData = snapshot.docs.map(doc => {
            return doc.data();
        });
        res.status(200).json(articlesData);
      })
      .catch(err => {
          console.log('Error getting documents', err);
          res.status(500).json(err);
     });
  });

///////////////// CREATE //////////////////////////////
  // Add one author
  app.post(API_URI + '/authors', bodyParser.urlencoded({ extended: true}), bodyParser.json({ limit: "10MB" }), (req, res) => { 
    let author = { ...req.body };
    console.log(".....author" + JSON.stringify(author));
    authorsCollection
        .add(author)
        .then(result => res.status(200).json("Author name added"))
        .catch(error => res.status(500).json(error));
})

// Add one article 
app.post(API_URI + '/articles', bodyParser.urlencoded({ extended: true}), bodyParser.json({ limit: "50MB" }), (req, res) => {
    let article = {... req.body };
    console.log(".....articles" + JSON.stringify(article));
    articlesCollection
        .add(article)
        .then(result => res.status(200).json("Article added"))
        .catch(error => res.status(500).json(error));
});

app.post(API_URI + '/categories', bodyParser.urlencoded({ extended: true}), bodyParser.json({ limit: "50MB" }), (req, res) => {
    let category = {... req.body };
    console.log(".....categories" + JSON.stringify(category));
    categoriesCollection
        .add(category)
        .then(result => res.status(200).json(result))
        .catch(error => res.status(500).json(error));
});

app.get(API_URI + '/categories', (req, res) => {
    categoriesCollection
    .get()
    .then(snapshot => {
        let categoriesArr = [];
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            var returnResult = {
                id: doc.id,
                result: doc.data()
            }
            categoriesArr.push(returnResult);       
    });
    res.status(200).json(categoriesArr);
   })
   .catch(err => {
     console.log('Error getting documents', err);
     res.status(500).json(err);
  }); 
});


app.put(API_URI + '/categories', bodyParser.urlencoded({ extended: true }), bodyParser.json({ limit: "10MB" }), (req, res) => {
    console.log(JSON.stringify(req.body));
    let category = {... req.body};
    let idValue = category.id
    console.log(idValue);
    categoriesCollection.doc(idValue).update(
        category,
        { merge: true });
        console.log(category) 
    res.status(200).json(category);
});

//////////////// UPDATE ////////////
// Edit author
app.put(API_URI + '/authors', bodyParser.urlencoded({ extended: true }), bodyParser.json({ limit: "10MB" }), (req, res) => {
    console.log(JSON.stringify(req.body));
    let author = {... req.body};
    let idValue = author.id
    console.log(idValue);
    authorsCollection.doc(idValue).update(
        author,
        { merge: true });
        console.log(author) 
    res.status(200).json(author);
});

// Edit article
app.put(API_URI + '/article/:id', bodyParser.urlencoded({ extended: true }), bodyParser.json({ limit: "50MB" }), (req, res) => {
    let idValue = req.params.id;
    console.log(idValue);
    console.log(JSON.stringify(req.body));
    let article = {... req.body};
    articlesCollection.doc(idValue).update(
        article,
        { merge: true });
        console.log(article)
    res.status(200).json(article);
});


//Upload single image
app.post(API_URI + '/upload', googleMulter.single('img'), (req, res) => {
        console.log("....uploading: ");
        if(req.file != null) {
           console.log("uploaded");
           uploadToFirebaseStorage(req.file).then((result) => {
               console.log(result);
               res.status(200).json(result)
           }).catch((error) => {
               console.log(error);
               res.status(500).json(error);
           })
        } else {
            res.status(500).json({ error: "error in uploading"});
        }
    });

const uploadToFirebaseStorage = (fileObject) => {
    return new Promise((resolve, reject) => {
        if(!fileObject) {
            reject("Invalid file upload attempt");
        }

        let idValue =  uuidv4();
        let newFilename = `${idValue}_${fileObject.originalname}`
        let firebaseFileUpload = bucket.file(newFilename);
        
        const blobStream = firebaseFileUpload.createWriteStream({
            metadata: {
                contentType: fileObject.mimeType
            }
        });

        blobStream.on("error", (error) => {
            console.log("error uploading" + error);
            reject("Error uploading file!");
        });

        blobStream.on("finish", () => {
            console.log("Uploading completed");
            let firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/day26-38142.appspot.com/o/${firebaseFileUpload.name}?alt=media&token=5aa67a11-cc55-4c04-9a39-177ab8dca9cc`;
            fileObject.fileURL = firebaseUrl;
            console.log(firebaseUrl);
            resolve(firebaseUrl);
        });

        blobStream.end(fileObject.buffer);
    });
}

////////////////// DELETE ///////////////////////////////
app.delete(API_URI + '/delete/articles/:id', (req, res) => {
    let idValue = req.params.id;
    articlesCollection.doc(idValue).delete().then((result) => {
        res.status(200).json(result);
    }).catch((error) => {
        res.status(500).json(error);
    });
});

app.delete(API_URI + '/authors', (req, res) => {
    let idValue = req.query.id;
    authorsCollection.doc(idValue).delete().then((result) => {
        res.status(200).json(result);
    }).catch((error) => {
        res.status(500).json(error);
    });
});

//////////////// Static Assets ////////////////////////
app.use(express.static(path.join(__dirname, '/public/mini-client_angular')));

const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000;
app.listen(PORT, () => {
    console.info(`Application started on port %d at %s`, PORT, new Date());
})