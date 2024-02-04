import User from "../models/User.js";
import Post from "../models/Post.js";
import { createError } from "../error.js"


export const createPost = async (req, res, next) => {
    try {
        const newPost = new Post({ userId: req.user.id, ...req.body });
        const savedPost = await newPost.save()
        res.status(200).json(savedPost);
    }
    catch (err) {
        next(err);
    }
}
export const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) return next(createError(404, "Post not found"))

        if (req.user.id === post.userId) {
            await Post.findByIdAndDelete(req.params.id);
            res.status(200).json("The Post has been deleted")
        }
        else {
            return next(createError(403, "You can delete Only your post!"));

        }
    }
    catch (err) {
        next(err);
    }
}
export const updatePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) return next(createError(404, "Post not found"))

        if (req.user.id === post.userId) {
            const updatedPost = await Post.findByIdAndUpate(req.params.id, {
                $set: req.body,
            },
                {
                    new: true
                }
            );
            res.status(200).json(updatedPost)
        }
        else {
            return next(createError(403, "You can create Only your post!"));

        }

    }
    catch (err) {
        next(err);
    }
}


export const like = async (req, res, next) => {
    try {

        const post = await Post.findById(req.params.id);
        if (post.likes.includes(req.user.id)) {
            const p = await Post.findByIdAndUpdate(req.params.id, {
                $pull: { likes: req.user.id }
            })
            res.status(200).json(p);
        }
        else {

            const p = await Post.findByIdAndUpdate(req.params.id, {
                $addToSet: { likes: req.user.id }
            })
            res.status(200).json(p);
        }
    }
    catch (err) {
        next(err);
    }
}



export const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.aggregate([{ $sample: { size: 40 } }])
        res.status(200).json(posts)
    }
    catch (err) {
        next(err);
    }

}

export const myPosts = async (req, res, next) => {
    try {
        const post = await Post.find({ userId: req.params.id });
        res.status(200).json(post)
    }
    catch (err) {
        next(err);
    }
}
