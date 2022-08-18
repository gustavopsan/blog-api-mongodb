const postModel = require('../../models/post');
const userModel = require('../../models/user');

async function createPost(title, description, tag, body, creatorId) {

    const creatorDataDb = await userModel.findById(creatorId);

    var creatorData = {
        id: creatorDataDb._id.toString(),
        name: creatorDataDb.name,
        avatar: creatorDataDb.avatar
    }

    try {
        const postCreated = await postModel.create({ 
            title, 
            description, 
            tag, 
            body,
            creatorData,
            visible: true
        });
        return postCreated;
    } catch (error) {
        return error;
    }
}

module.exports = createPost;