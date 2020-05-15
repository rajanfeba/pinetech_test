const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const port = process.env.PORT||3000;
app.use('/', require('./controller/router'));

app.use(bodyParser.urlencoded({extended:true}));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
})

mongoose.connect('mongodb://localhost:27017/pinetech', (error) => {
  (error) ? console.log("have error", { useNewUrlParser: true,
    useCreateIndex: true,useUnifiedTopology: true  }, error) : console.log("DB connected")
});

app.listen(port, () =>
    console.log(`--------------app listening on port ${port}!`))