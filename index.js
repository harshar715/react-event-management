const express = require('express');
const bodyparser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const mongoose = require('mongoose');
const cors = require('cors');

const graphqlSchemas = require('./graphql/schemas/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const config = require('./config.json');
const isAuth = require('./middleware/is-auth');

const app = express();

// app.use(cors());

app.use(bodyparser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public', { maxAge: 31557600 }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-control-Allow-Headers', 'Content-Type, Authorization');
    if(req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
})

app.use(isAuth);

app.use('/graphql', graphqlHttp({
    schema: graphqlSchemas,
    rootValue: graphqlResolvers,
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${config.env.MONGO_USER}:${config.env.MONGO_PASS}@mydatabase.imncy.mongodb.net/${config.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }).then(() => { console.log('connected to db') }).catch(err => console.log(err));
mongoose.Promise = global.Promise;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`app listening at ${PORT}`))