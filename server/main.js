const express = require('express'),
      path = require('path'),
      admin = require('firebase-admin'),
      { Storage } = require('@google-cloud/storage'),
      bodyParser = require('body-parser'),
      multer = require("multer"),
      cors = require('cors');

const app = express();

const API_URI = "/api";
app.use(cors());

//set GOOGLE_APPLICATION_CREDENTIALS=/Users/phangty/Projects/paf-day26/onfire.json
// Initialize Firebase
const credFile = process.env.Svc_Cred_File || "./f.json";

var serviceAccount = require(credFile);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mini-bbb5b.firebaseio.com"
});

var db = admin.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
db.settings(settings);

var authorsCollection = db.collection('authors');
var topicsCollection = db.collection('topics');
var articlesCollection = db.collection('articles');

//export Google_Application_Credentials
const gStorage = new Storage({
      projectId: "mini-bbb5b"
});

const bucket = gStorage.bucket("mini-bbb5b.appspot.com");
const googleMulter = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024 //20MB
    }
})

var addCounter = 0;
var updateCounter = 0;

var unSubscribe = subscribeArticles();

function subscribeArticles() {
    return articlesCollection.onSnapshot((snapshot) => {
        if(!snapshot.empty) {
            //console.log(snapshot);
            snapshot.docChanges.forEach((data) => {
                console.log(`==>${ Date() } ${ updateCounter }` + data.type);
                if(data.type === 'modified') {
                    updateCounter = updateCounter + 1
                }else if(data.type === 'added') {
                    addCounter = addCounter + 1;
                }
            })
        }
    });
}

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
    let topic = req.query.topic
    console.log(topic);
    if (typeof(topic === 'undefined')){
        if (topic === '') {
            console.log('topic is undefined');
            res.status(500).json({error: "topic is undefined"});
        }
    }
    topicsCollection
        .where('topic', '==', topic)
        .limit(5)
    articlesCollection
    .get()
    .then(snapshot => {
        // No need to push to an array because we're using map here to create a new array
        let snapshotPromises = snapshot.docs.map(doc => {
            const authorId = doc.data().author_id;
            let articleData = doc.data();

            if (typeof authorId !== 'undefined') {
                const authorRef = authorsCollection.doc(authorId);
                return authorRef.get().then(authorSnapshot => {
                    articleData.author = authorSnapshot.data();
                    return articleData;
                });
            } else {
                return articleData;
            }
        });

        Promise.all(snapshotPromises).then(results => {
            res.status(200).json(results);
        });
   })
   .catch(err => {
     console.log('Error getting documents', err);
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
    })

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
app.post(API_URI + '/upload', bodyParser.urlencoded({ extended: true }), bodyParser.json({ limit: "20MB" }),
    googleMulter.single('img'), (req, res) => {
        console.log("....uploading: ");
        if(req.file.length) {
           console.log("uploaded");
           console.log(req.file);
           uploadToFirebaseStorage(req.file).then((result) => {
               console.log(result);
               console.log(result.data);
               var galleryData = {
                   filename: result
               }
               galleryCollection
               .add(galleryData)
               .then(result => res.status(200).json(galleryData))
               .catch(error => res.status(500).json(error));
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

            let idValue = uuidv5('', uuidv5.DNS);
            console.log(idValue);

            let newFilename = `${idValue}_${fileObject.originalname}`
            console.log(newFilename);

            let firebaseFileUpload = bucket.file(newFilename);
            console.log(firebaseFileUpload);

            const blobStream = firebaseFileUpload.createWriteStream({
                metadata: {
                    contentType: fileObject.mimeType
                }
            });

            blobStream.on("error", (error) => {
                console.log("error uploading" + error);
                reject("Error uploading file!");
            });

            blobStream.on("complete", () => {
                console.log("Uploading completed");
                let firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/mini-bbb5b.appspot.com/o/${firebaseFileUpload.name}?alt=media&token=9d608f06-1fdc-40dc-8045-aa9a6b20b635`;
                fileObject.fileURL = firebaseUrl;
                resolve(firebaseUrl);
            });

            blobStream.end(fileObject.buffer);
        });
    }

//Upload an array of images
app.post(API_URI + '/upload-multiple', googleMulter.array('imgs, 6'), (req, res, next) => {
    res.status(200).json({});
});


////////////////// DELETE ///////////////////////////////
app.delete(API_URI + '/delete/articles/:id', (req, res) => {
    let idValue = req.params.id;
    articlesCollection.doc(idValue).delete().then((result) => {
        res.status(200).json(result);
    }).catch((error) => {
        res.status(500).json(error);
    });
});


///////////// UNSUBSCRIBE & SUBSCRIBE TO LISTENING FOR CHANGES ///////////
app.get(API_URI + '/unsubscribe-article', (req, res) => {
    unSubscribe();
    res.status(200).json({ addCounter, updateCounter});
});

app.get(API_URI + '/subscribe-article', (req, res) => {
    unSubscribe = subscribeArticles();
    res.status(200).json({ addCounter, updateCounter });
})


//////////////// Static Assets ////////////////////////
app.use(express.static(path.join(__dirname, '/public/mini-client_angular')));

const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000;
app.listen(PORT, () => {
    console.info(`Application started on port %d at %s`, PORT, new Date());
})