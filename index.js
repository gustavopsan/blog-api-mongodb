const JWT = require('jsonwebtoken');
const CORS = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

require('./controllers/database/connection');

const userModel = require('./models/user');

const createUser = require('./controllers/user/createUser');
const authenticateUser = require('./controllers/user/authenticateUser');
const checkSession = require('./controllers/user/checkSession');
const updateUser = require('./controllers/user/updateUser');

const validateEmail = require('./middlewares/validateEmail');
const validatePassword = require('./middlewares/validatePassword');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    app.use(CORS());
    next();
});

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
})

app.post('/createUser', async (req, res) => {
    const { name, email, password, passwordConfirm, avatar, active } = req.body;

    if (password !== passwordConfirm) {
        res.json({
            errorId: 'register_01',
            message: 'Password does not match'
        });
    } else if (!validateEmail(email)) {
        res.json({
            errorId: 'register_02',
            message: 'Invalid email format'
        });
    } else if (!validatePassword(password)) {
        res.json({
            errorId: 'register_03',
            message: 'Invalid password format'
        });
    } else {
        createUser(name, email, password, avatar, active)
            .then(response => {
                if (response.hasOwnProperty('keyValue')) {
                    return res.json({
                        errorId: 'register_04',
                        message: 'Email already exists'
                    });
                } else {
                    return res.json({
                        message: 'User created successfully'
                    });
                }
            });
    }
    
})

app.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    authenticateUser(email, password).then(response => {
        if(response.errorId == 'auth_01'){
            res.json({
                errorId: 'auth_01',
                message: 'User not found'
            });
        } else if(response.errorId == 'auth_02'){
            res.json({
                errorId: 'auth_02',
                message: 'Password does not match'
            });
        } else if(response.errorId == 'auth_03'){
            res.json({
                errorId: 'auth_03',
                message: 'User is not active'
            });
        } else {
            const token = JWT.sign({ id: response._id }, process.env.SECRET, { expiresIn: '1m' });

            res.json({
                userId: response._id,
                token
            });
        }
    }).catch(error => {
        res.json(error);
    })
})

app.post('/checkSession', async (req, res) => {
    const { token } = req.body;

    checkSession(token).then(response => {
        if(response.errorId == 'auth_01'){
            res.json({
                errorId: 'auth_01',
                message: 'User not found'
            });
        } else {
            res.json(response);
        }
    }).catch(error => {
        res.json(error);
    })
})

app.get('/getUsers', async (req, res) => {
    try {
        const users = await userModel.find();
        res.json(users);
    } catch (error) {
        res.json(error);
    }
})

app.post('/updateUser', async (req, res) => {
    const { id, key, value } = req.body;

    updateUser(id, key, value).then(response => {
        res.json(response);
    }).catch(error => {
        res.json(error);
    })
})

app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
})