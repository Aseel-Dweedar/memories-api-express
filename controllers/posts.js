import PostMessage from "../models/postMessage.js"
import mongoose from "mongoose";

export const getPosts = async (req, res) => {

    let { page } = req.query;
    page = Number(page);

    try {

        const LIMIT = 8;
        const startIndex = (page - 1) * LIMIT;
        const total = await PostMessage.countDocuments({});
        // const total = LIMIT * page;

        // sort by {_id : -1} means sort from newest to oldest by id
        // limit give a specific limit of items
        // skip will make it count from a specific point (starting point)
        const postMessage = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.status(200).json({ data: postMessage, currentPage: page, numberOfPages: Math.ceil(total / LIMIT) })

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => {

    let { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const getPostsBySearch = async (req, res) => {

    const { searchQuery, tags } = req.query;

    try {

        // use regex because it's easier for express to find them
        const title = new RegExp(searchQuery, "i");

        // $or : search for something or something (in this case title or tags)
        // $in : if there is on of the tags is matching our array of tags
        const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] });

        res.json(posts)

    } catch (error) {
        res.status(404).json({ message: error.message, state: "Can't find Posts" });
    }
}

export const createPost = async (req, res) => {

    const post = req.body;
    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });

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

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });
    res.json(updatedPost);

}

export const likePost = async (req, res) => {

    const { id } = req.params;

    if (!req.userId) return res.json({ message: 'Unauthenticated' })

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json("No Post With This Id!");

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
        post.likes.push(req.userId);
    } else {
        post.likes = post.likes.filter((id) => id != req.userId)
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);

}

export const deletePost = async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json("No Post With This Id!");

    await PostMessage.findOneAndRemove(id);
    res.json({ message: "Deleted successfully" });

}