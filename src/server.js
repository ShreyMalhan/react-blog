// to initialize the folder as an npm package => npm init -y

// install express => npm i --s express

// Express.js, or simply Express, is a back end web application framework for Node.js, released as free and open-source software under 
// the MIT License. It is designed for building web applications and APIs

// "npm install --save-dev @babel/core @babel/node @babel/preset-env" help us to install babel which helps us to write code in ES6 
// because node.js does not support ES6 

// "npm install --save body-parser" helps our server extract json data that we send with out request in a post endpoint 

// to run => npx babel-node src/server.js then navigate to http://localhost:8000/hello

// npm i --s nodemon so that we do not need to rerun the server manually everytime we change the code.
// We added "npx nodemon --exec npx babel-node src/server.js" under the scripts tag in package.json because it was long and hard to remember.
// To run the server now => npm start


// downloaded and installed mongodb in the computer

// install mongodb package to the project => npm i --s mongodb. Now we can access and modify our local database from inside
// the express server and our data will not be wiped out everytime our server restarts


import express from 'express';
import bodyParser from 'body-parser';
import {MongoClient} from 'mongodb'; // allows us to connect to our local database
import path from 'path';

// fake database to keep track of upvotes
// const articleInfo = {
//     'learn-react':{
//         upvotes: 0,
//         comments: [],
//     },
//     'learn-node':{
//         upvotes: 0,
//         comments: [],     
//     }, 
//     'my-thoughts-on-resumes': {
//         upvotes: 0,
//         comments: [],
//     }
// }

const app = express();

// following line of code tells our server where to serve static files sych as image from.

// **IT IS REQUIRED TO CONNECT FRONT END TO BACK END**

app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json()); 
// parses the json object that we have included along with our post request and adds a body property to the 
// request parameter for the matching route


app.get('/hello',(req, res) => res.send('Hello!')); // this get endpoint returns hello when triggered

// the post endpoints takes extra info with them as a body parameter! In the PostMan app, Select Body then raw and change text to JSON
// type => {"name": "Shrey"} 
app.post('/hello',(req, res) => res.send(`Hello ${req.body.name}!`));

// we can do the same as above with a get request. We do this using URL parameters
app.get('/hello/:name', (req,res) => res.send(`Hello ${req.params.name}!`)); // It grabs whatever there is in the URL after /hello/


// this endpoint is used to increase upvotes for fake database
// app.post('/api/articles/:name/upvote', (req, res) => {

//     const articleName = req.params.name;        // params is used when we fetch something from URL

//     articleInfo[articleName].upvotes += 1;

//     res.status(200).send(`The article now has ${articleInfo[articleName].upvotes} upvotes!`)
// });



// this endpoint is used to add comments for fake database
// app.post('/api/articles/:name/add-comment', (req, res) => {

//     const {username, text} = req.body;
//     const articleName = req.params.name;

//     articleInfo[articleName].comments.push({username, text});

//     res.status(200).send(articleInfo[articleName]);
// });


const withDB = async (operation, res) => {
    
    try{

        const client = await MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true});
        // first argument is the url of the database and mongodb by default runs on port 27017
        // second argument is an options object which we can use to change certain parameters about our connection to mongodb
        // it will give an error if we not use the option "{useNewUrlParser: true}"
        // this is an async command which returns a client object which we can use to send queries to database
    

        const db = client.db('my-blog'); // 'my-blog' is the name of the database we want to query and now we can query the database

        await operation(db);  // calling the operation argument which is a function with db variable
    
        client.close(); // closes the connection to the database
    }
    catch(error){
        res.status(500).json({message: 'Error connecting to database', error}); // 500 is the code for internal server error
    }
}


app.get("/api/articles/:name", async (req, res) => { // since we are using await keyword, do not forget the async keyword

    withDB( async (db) => {
        const articleName = req.params.name;

        // the following query will look into the 'articles' collection of the database and find the matching name article 
        const articleInfo = await db.collection('articles').findOne({ name: articleName });
    
        // now we can send the articleInfo as a json object
        res.status(200).json(articleInfo);
    }, res);
});


// this endpoint is used to increase upvotes with mongodb database and stores how many upvotes have been registered
app.post('/api/articles/:name/upvote', async (req, res) => {

    withDB(async(db) => {
        const articleName = req.params.name;        // params is used when we fetch something from URL

        const articleInfo = await db.collection('articles').findOne({ name: articleName });
 
        await db.collection('articles').updateOne({ name: articleName }, {
            // now we have the article who's upvotes we want to increase. To do that we need to write another query to update number of upvotes
            // mongodb have a special syntax for the updates we want to apply to the object
            '$set': {
                upvotes: articleInfo.upvotes + 1,
            },
        });

        // now we want the updated article
        const updatedArticleInfo = await db.collection('articles').findOne({ name: articleName });

        res.status(200).json(updatedArticleInfo);

    }, res);
});


app.post('/api/articles/:name/add-comment', (req, res) => {

    withDB(async (db) => {
            
        const {username, text} = req.body;
        const articleName = req.params.name;

        const articleInfo = await db.collection('articles').findOne({name: articleName});

        await db.collection('articles').updateOne({name: articleName}, {
            '$set': {
                comments: articleInfo.comments.concat({username, text}),
            },
        })

        const updatedArticleInfo = await db.collection('articles').findOne({name: articleName});

        res.status(200).json(updatedArticleInfo);
    }, res)

});

// The next endpoint tells our app that all requests that are caught by any of our other api routes should be passed on to our app.
// this will allow our client side of app to navigate between pages and process URL correctly which is very important 

// **IT IS REQUIRED TO CONNECT FRONT END TO BACK END**

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
})

// prints out on consol once the server starts to make sure its working
app.listen(8000, () => console.log('Listening'));



// ************** TO CONNECT FRONT END TO BACK END *******************
// 1.) cd into the front end folder.
// 2.) run the command `npm run build`.
// 3.) a 'build' folder will be created into the front end folder.
// 4.) copy paste the 'build' folder into the 'src' folder of the back end.
// 5.) Write the required lines of code stated above. 
// 6.) Now your front end is connected to back end and your app will run on single server instead of seperate
// 7.) Navigate to localhost:8000
