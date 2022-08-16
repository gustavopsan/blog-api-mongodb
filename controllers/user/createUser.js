const userModel = require('../../models/user');

async function createUser(name, email, password, avatar, active) {
    try {
        const userCreated = await userModel.create({ 
            name, 
            email, 
            password, 
            avatar, 
            active 
        });
        return userCreated;
    } catch (error) {
        return error;
    }
}

module.exports = createUser;