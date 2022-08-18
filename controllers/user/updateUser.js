const userModel = require('../../models/user');

async function updateUser(id, key, value) {
    try {
        const user = await userModel.findByIdAndUpdate({ _id: `${id}` }, { [key]: value }, { new: false });

        if(user) {
            newUser = await userModel.findById({ _id: `${id}` });
            return newUser;
        }
    } catch (error) {
        return error;
    }
}

module.exports = updateUser;