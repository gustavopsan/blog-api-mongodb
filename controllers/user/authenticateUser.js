const userModel = require('../../models/user');

async function authenticateUser(email, password) {
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return {
                errorId: 'auth_01',
                error: 'User not found'
            };
        } else if (user.password !== password) {
            return {
                errorId: 'auth_02',
                error: 'Password does not match'
            };
        } else if (!user.active) {
            return {
                errorId: 'auth_03',
                error: 'User is not active'
            };
        } else {
            return user;
        }
    } catch (error) {
        return error;
    }
}

module.exports = authenticateUser;