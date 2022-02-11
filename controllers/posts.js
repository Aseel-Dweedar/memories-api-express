import PostMessage from "../models.js/postMessage.js"

export const getPosts = async (req, res) => {
    try {
        const postMessage = await PostMessage.find();
        res.status(200).json(postMessage)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {

    const post = req.body;
    const newPost = new PostMessage(post);

    try {
        await newPost.save();
        res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {

    // re-name id to _id
    const { id: _id } = req.params;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json("No Post With This Id!");

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true });
    res.json(updatedPost);

}

export const deletePost = async (req, res) => {

    const { id: _id } = req.params;

    try {
        await PostMessage.deleteOne({ _id });
        res.status(202).json("Deleted successfully")
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}