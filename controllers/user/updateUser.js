const userModel = require('../../models/user');

async function updateUser(id, key, value) {
    try {
        const user = await userModel.findByIdAndUpdate({ _id: `${id}` }, { [key]: value }, { new: false });

        return user;
    } catch (error) {
        return error;
    }
}

module.exports = updateUser;