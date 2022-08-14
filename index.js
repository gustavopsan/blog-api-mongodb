const express = require('express');
const app = express();
const JWT = require('jsonwebtoken');
const mongoConnection = require('./database/connection');
const userModel = require('./models/user');
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
})

app.post('/createUser', async (req, res) => {
    const { name, email, password, avatar, active } = req.body;

    try {
        const newUser = await userModel.create({
            name,
            email,
            password,
            avatar,
            active
        });

        res.json(newUser);
    } catch (error) {
        res.status(500).json(error);
    }
})

app.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                errorId: 'auth_01',
                error: 'User not found' 
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                errorId: 'auth_02',
                error: 'Password does not match'
            });
        }

        const token = JWT.sign({ id: user._id }, process.env.SECRET, { expiresIn: '1m' });

        res.json({
            userId: user._id,
            token
        });
    } catch (error) {
        res.status(500).json(error);
    }
})

app.post('/checkSession', async (req, res) => {
    const { token } = req.body;

    try {
        const decoded = JWT.verify(token, process.env.SECRET);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                errorId: 'auth_03',
                error: 'User not found'
            });
        }

        res.json({
            userId: user._id,
            Name: user.name,
            Email: user.email,
            Avatar: user.avatar,
            Biography: user.biography,
            Active: user.active
        });
    } catch (error) {
        res.status(500).json(error);
    }
})

app.get('/getUsers', async (req, res) => {
    try {
        const users = await userModel.find();
        res.json(users);
    } catch (error) {
        res.status(500).json(error);
    }
})

app.post('/updateUserName', async (req, res) => {
    const { id, name } = req.body;

    try {
        const user = await userModel.findByIdAndUpdate({ _id: `${id}` }, { name }, { new: false });

        res.json(user);
    } catch (error) {
        res.status(500).json(error);
    }
})

app.post('/updateUserPassword', async (req, res) => {
    const { id, password } = req.body;

    try {
        const user = await userModel.findByIdAndUpdate({ _id: `${id}` }, { password }, { new: false });

        res.json(user);
    } catch (error) {
        res.status(500).json(error);
    }
})

app.post('/updateUserBio', async (req, res) => {
    const { id, biography } = req.body;

    try {
        const user = await userModel.findByIdAndUpdate({ _id: `${id}` }, { biography }, { new: false });

        res.json(user);
    } catch (error) {
        res.status(500).json(error);
    }
})

app.post('/updateUserAvatar', async (req, res) => {
    const { id, avatar } = req.body;

    try {
        const user = await userModel.findByIdAndUpdate({ _id: `${id}` }, { avatar }, { new: false });

        res.json(user);
    } catch (error) {
        res.status(500).json(error);
    }
})

app.post('/updateUserActive', async (req, res) => {
    const { id, active } = req.body;

    try {
        const user = await userModel.findByIdAndUpdate({ _id: `${id}` }, { active }, { new: false });

        res.json(user);
    } catch (error) {
        res.status(500).json(error);
    }
})



app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
})