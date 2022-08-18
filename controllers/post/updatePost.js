const postModel = require('../../models/post');

async function updatePost(postId, creatorId, title, description, tag, body, visible){
    const postSelected = await postModel.findById(postId);

    if(postSelected){
        if(postSelected.creatorData.id === creatorId){
            try {
                const postUpdated = await postModel.findByIdAndUpdate(postId, {
                    title,
                    description,
                    tag,
                    body,
                    visible
                }, { new: false });
                return postUpdated;
            } catch (error) {
                return error;
            }
        } else {
            return {
                errorId: "post-update_1",
                message: 'You are not the creator of this post'
            }
        }
    } else {
        return {
            errorId: "post-update_2",
            message: 'Post not found'
        }
    }
}

module.exports = updatePost;