const JWT = require('jsonwebtoken');
const CORS = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

require('./controllers/database/connection');

const userModel = require('./models/user');
const postModel = require('./models/post');

// User Controllers
const createUser = require('./controllers/user/createUser');
const authenticateUser = require('./controllers/user/authenticateUser');
const checkSession = require('./controllers/user/checkSession');
const updateUser = require('./controllers/user/updateUser');

// Post Controllers
const createPost = require('./controllers/post/createPost');
const updatePost = require('./controllers/post/updatePost');

// Middlewares
const validateEmail = require('./middlewares/validateEmail');
const validatePassword = require('./middlewares/validatePassword');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS
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

// User Routes

app.post('/createUser', async (req, res) => {
    const { name, email, password, passwordConfirm, avatar, active } = req.body;

    console.log("Blog API MongoDB - createUser - Iniciando criação de novo usuário");

    if (password !== passwordConfirm) {
        console.log("Blog API MongoDB - createUser - Senhas não conferem");

        res.json({
            errorId: 'register_01',
            message: 'Password does not match'
        });
    } else if (!validateEmail(email)) {
        console.log("Blog API MongoDB - createUser - Email com formato inválido");

        res.json({
            errorId: 'register_02',
            message: 'Invalid email format'
        });
    } else if (!validatePassword(password)) {
        console.log("Blog API MongoDB - createUser - Senha com formato inválido");

        res.json({
            errorId: 'register_03',
            message: 'Invalid password format'
        });
    } else {
        createUser(name, email, password, avatar, active)
            .then(response => {
                if (response.hasOwnProperty('keyValue')) {
                    console.log("Blog API MongoDB - createUser - Email já cadastrado");

                    return res.json({
                        errorId: 'register_04',
                        message: 'Email already exists'
                    });
                } else {
                    console.log("Blog API MongoDB - createUser - Usuário " + response._id + " criado com sucesso");

                    return res.json({
                        message: 'User created successfully'
                    });
                }
            });
    }
    
})

app.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    console.log("Blog API MongoDB - authenticate - Iniciando autenticação de usuário");

    authenticateUser(email, password).then(response => {
        if(response.errorId == 'auth_01'){
            console.log("Blog API MongoDB - authenticate - Usuário não encontrado com o email informado");

            res.json({
                errorId: 'auth_01',
                message: 'User not found'
            });
        } else if(response.errorId == 'auth_02'){
            console.log("Blog API MongoDB - authenticate - Senha incorreta");

            res.json({
                errorId: 'auth_02',
                message: 'Password does not match'
            });
        } else if(response.errorId == 'auth_03'){
            console.log("Blog API MongoDB - authenticate - Usuário inativo");

            res.json({
                errorId: 'auth_03',
                message: 'User is not active'
            });
        } else {
            const token = JWT.sign({ id: response._id }, process.env.SECRET, { expiresIn: '1d' });

            console.log("Blog API MongoDB - authenticate - Usuário " + response._id + " autenticado com sucesso");

            res.json({
                userId: response._id,
                token
            });
        }
    }).catch(error => {
        console.log("Blog API MongoDB - authenticate - Erro ao autenticar usuário", error);

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
        } else if (response.message == 'jwt expired') {
            res.json({
                errorId: 'auth_02',
                message: 'Session expired'
            });
        } else {
            res.json(response);
        }
    }).catch(error => {
        res.json(error);
    })
})

app.post('/updateUser', async (req, res) => {
    const { id, key, value } = req.body;

    console.log("Blog API MongoDB - updateUser - Atualizando usuário");

    updateUser(id, key, value).then(response => {
        console.log("Blog API MongoDB - updateUser - Usuário atualizado com sucesso");

        res.json(response);
    }).catch(error => {
        console.log("Blog API MongoDB - updateUser - Erro ao atualizar usuário", error);

        res.json(error);
    })
})

app.get('/getUsers', async (req, res) => {
    console.log("Blog API MongoDB - getUsers - Retornando todos os usuários");

    try {
        const users = await userModel.find();
        res.json(users);
    } catch (error) {
        res.json(error);
    }
})

// Post Routes

app.post('/createPost', async (req, res) => {
    const { title, description, tag, body, creatorId } = req.body;

    console.log("Blog API MongoDB - createPost - Iniciando criação de novo post");

    createPost(title, description, tag, body, creatorId).then(response => {

        console.log("Blog API MongoDB - createPost - Post " + response._id + " criado com sucesso");

        res.json({
            message: 'Post created successfully',
            response
        });
    })
})

app.get('/getPosts', async (req, res) => {
    console.log("Blog API MongoDB - getPosts - Retornando todos os posts");

    try {
        const posts = await postModel.find();
        res.json(posts);
    } catch (error) {
        res.json(error);
    }
})

app.get('/getPost', async (req, res) => {
    const { id } = req.body;

    console.log("Blog API MongoDB - getPost - Retornando post com id " + id);

    try {
        const post = await postModel.findById(id);
        res.json(post);
    } catch (error) {
        res.json(error);
    }
})

app.post('/updatePost', async (req, res) => {
    const { postId, creatorId, title, description, tag, body, visible } = req.body;

    console.log("Blog API MongoDB - updatePost - Iniciando atualização de post");

    updatePost(postId, creatorId, title, description, tag, body, visible).then(response => {
        if (response.errorId == 'post-update_1'){
            console.log("Blog API MongoDB - updatePost - usuário não é o criador do post");

            res.json({
                errorId: 'post-update_1',
                message: 'User is not the creator of the post'
            });
        } else if (response.errorId == 'post-update_2'){
            console.log("Blog API MongoDB - updatePost - post não encontrado");

            res.json({
                errorId: 'post-update_2',
                message: 'Post not found'
            });
        } else {
            console.log("Blog API MongoDB - updatePost - Post " + response._id + " atualizado com sucesso");

            res.json({
                message: 'Post updated successfully',
                response
            });
        }
    })
})

app.listen(PORT, () => {
    console.log('Blog API MongoDB - Server started on port ' + PORT);
})