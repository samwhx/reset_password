const express = require('express'),
      path = require('path'),
      admin = require('firebase-admin'),
      googleStorage = require('@google-cloud/storage'),
      bodyParser = require('body-parser'),
      cors = require('cors');

const app = express();

const API_URI = "/api";

// Initialize Firebase
const credFile = process.env.Svc_Cred_File || "./f.json";

var serviceAccount = require(credFile);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mini-bbb5b.firebaseio.com"
});

var db = admin.firestore();

var authorsCollection = db.collection('authors');
var topicsCollection = db.collection('topics');
var articlesCollection = db.collection('articles');

//export Google_Application_Credentials
/*const gStorage = googleStorage({
      projectId: "mini-bbb5b"
});

const bucket = gStorage.bucket("mini-bbb5b.appspot.com");
const googleMulter = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024 //20MB
    }
})
*/
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
            authorsArr.push(doc.data());       
    });
    res.status(200).json(authorsArr);
   })
   .catch(err => {
     console.log('Error getting documents', err);
  }); 
});

// GET one author 
app.get(API_URI + '/author/search', (req, res) => {
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
        .limit(10)
    .get()
    .then(snapshot => {
        console.log(">>>snapshot");
        let authorsArr = [];
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            authorsArr.push(doc.data());
        });
        res.status(200).json(authorsArr);
      })
      .catch(err => {
          console.log('Error getting documents', err);
          res.status(500).json(err);
     });
  });

// GET array of articles by topic
app.get(API_URI + '/articles/search', (req, res) => {
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
        let articlesArr = [];
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            const authorId = doc.data().author_id;
            let articleData = doc.data();

            console.log('Author ID is:', authorId);

            if (typeof authorId !== 'undefined') {
                const authorRef = authorsCollection.doc(authorId);
                let authorPromise = authorRef.get().then(authorSnapshot => {
                    console.log('Found an author: ', authorSnapshot.data())
                    articleData.author = authorSnapshot.data()
                });
                Promise.all(authorPromise).then(result => {
                    articlesArr.push(articleData);
                })
            }
            articlesArr.push(articleData);
        });
        res.status(200).json(articlesArr);
   })
   .catch(err => {
     console.log('Error getting documents', err);
  }); 
});

// GET one article by title
app.get(API_URI + '/article/search', (req, res) => {
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
        console.log(">>>snapshot");
        let articlesArr = [];
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            articlesArr.push(doc.data());
        });
        res.status(200).json(articlesArr);
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
app.post(API_URI + '/articles', bodyParser.urlencoded({ extended: true}), (req, res) => {
    let article = {... req.body };
    console.log(".....articles" + JSON.stringify(article));
    articlesCollection
        .add(article)
        .then(result => res.status(200).json("Article added"))
        .catch(error => res.status(500).json(error));
    })

//////////////// UPDATE ////////////
// Edit author
app.put(API_URI + '/author/:id', bodyParser.urlencoded({ extended: true }), (req, res) => {
    let idValue = req.params.id;
    console.log(idValue);
    console.log(JSON.stringify(req.body));
    let author = {... req.body};
    authorsCollection.doc(idValue).update(
        author,
        { merge: true });
        console.log(author) 
    res.status(200).json(author);
});

// Edit article
app.put(API_URI + '/article/:id', bodyParser.urlencoded({ extended: true }), (req, res) => {
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



const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000;
app.listen(PORT, () => {
    console.info(`Application started on port %d at %s`, PORT, new Date());
})