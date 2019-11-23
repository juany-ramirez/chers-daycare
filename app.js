const express =  require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

//Import Routes

//*Middleware
app.use(bodyParser.json());
app.use(cors());
//**MyRoutes
app.use('/api/posts', require('./routes/posts'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admins', require('./routes/administrators'));
app.use('/api/caretakers', require('./routes/caretakers'));
app.use('/api/kids', require('./routes/kids'));
app.use('/api/parents', require('./routes/parents'));
app.use('/api/auth', require('./routes/authentications'));


app.get('/',(req, res)=>{
     res.send('Hello World');
});

mongoose.Promise = global.Promise;
mongoose.connect( process.env.DB_CONNECTION, { useNewUrlParser: true }, ()=> {
    console.log('Connected to db')
});

app.listen(process.env.PORT || 4000)