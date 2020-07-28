'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');
const { render } = require('ejs');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
const client = new pg.Client(process.env.DATABASE_URL);


const PORT = process.env.PORT || 3000;


// app.get('/search', (req, res) => {
//     res.render('pages/searches/search.ejs');
// })


app.get('/', (req, res) => {
    let SQL = ' SELECT * FROM joke;';
    client.query(SQL)
        .then(results => {
            res.render('pages/index', { resultsKey: results.rows });
        })
        .catch(error => errorHandler(error));

})


// FORE UPDATE
app.put('/updateData/:id', (req, res) => {
    let { type, setup, punchline } = req.body;
    let id = req.params.id;
    let SQL = `UPDATE joke SET type=$1, setup=$2, punchline=$3 WHERE id=$4;`;
    let safaValue = [type, setup, punchline, id];
    client.query(SQL, safeValue)
        .then(result => {
            res.redirect(`/details/${id}`);
        })


})

// FOR DELETE 
app.delete('/delete/:id', (req, res) => {

    let id = req.params.id;
    let SQL = `DELETE FROM joke WHERE id=$1`;
    let safeValue = [id];
    client.query(SQL, safeValue)
        .then(() => {
            res.redirect('/');
        })
})



app.get('/details/:id', (req, res) => {
    let safeValue = [req.params.id];
    let SQL = ` SELECT * FROM joke WHERE id=$1;`;
    client.query(SQL, safeValue)
        .then((result) => {
            console.log(data);
            res.render('pages/searches/details', { resultKet: data.rows });

        })

})


app.get('/search', (req, res) => {

    let url = `https://official-joke-api.appspot.com/jokes/programming/ten`;
    superagent.get(url)
        .then(result => {
            let resultData = result.body.map((item) => {
                let jokeOBJ = new Joke(item);
                return jokeOBJ;

            })
            console.log(resultData);
            res.render('pages/searches/search.ejs', { resultKey: resultData })
        })

})


app.get('/random', (req, res) => {

    let url = `https://official-joke-api.appspot.com/jokes/programming/random`;
    superagent.get(url)
        .then(result => {
            let resultData = result.body.map((item) => {
                let jokeOBJ = new Joke(item);
                return jokeOBJ;

            })
            console.log(resultData);
            res.render('pages/searches/random.ejs', { resultKey: resultData })
        })

})



app.post('/showAddFav', (req, res) => {
    let { type, setup, punchline } = req.body;
    let SQL = `INSERT INTO joke(type,setup,punchline) VALUES ($1,$2,$3);`;
    let values = [type, setup, punchline];
    client.query(SQL, values)
        .then(() => {
            console.log(req.body);
            res.redirect('/');
        })

})



function Joke(jokeData) {
    this.type = jokeData.type;
    this.setup = jokeData.setup;
    this.punchline = jokeData.punchline;

}


function errorHandler(error, req, res) {
    res.status(500).send(error);
}


client.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`lestening on PORT ${PORT}`);
        })
    })