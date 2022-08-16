const JWT = require('jsonwebtoken');
const userModel = require('../../models/user');

async function checkSession(token) {
    try {
        const decoded = JWT.verify(token, process.env.SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return {
                errorId: 'auth_01',
                error: 'User not found'
            };
        }

        return {
            userId: user._id,
            Name: user.name,
            Email: user.email,
            Avatar: user.avatar,
            Biography: user.biography,
            Active: user.active
        };
    } catch (error) {
        return error;
    }
}

module.exports = checkSession;