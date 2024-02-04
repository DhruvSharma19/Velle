import { createError } from "../error.js";
import User from "../models/User.js";

export const deleteUser = async (req, res, next) => {
    try {
        if (req.params.id == req.user.id) {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted.")
        }
        else {
            return next(createError(403, "You can delete only your account."))
        }

    }
    catch (err) {
        next(err);
    }

}

export const updateUser = async (req, res, next) => {
    try {
        if (req.user.id === req.params.id) {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            },
                { new: true });
            res.status(200).json(updatedUser)
        }
        else {
            return next(createError(403, "You can update only your account"))
        }

    }
    catch (err) {
        next(err);
    }

}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(createError(404, "User not found"));
        }
        const { password, ...others } = user._doc
        res.status(200).json(others);
    }
    catch (err) {
        next(err);
    }

}


export const getUsers = async (req, res, next) => {
    const query = req.query.q
    try {
        const users = await User.find({ name: { $regex: query, $options: "i" }, }).limit(40);
        res.status(200).json(users)

    } catch (err) {
        next(err)
    }

}


export const addFriend = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $push: { friends: req.params.id },
        });
        await User.findByIdAndUpdate(req.params.id, {
            $push: { friends: req.user.id },
        });
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { requests: req.params.id },
        });
        res.status(200).json("Friend added")

    }
    catch (err) {
        next(err);
    }

}


export const requestFriend = async (req, res, next) => {
    try {
        const u = await User.findById(req.user.id);
        const r = await User.findById(req.params.id)

        if (req.params.id != req.user.id && !u.friends.includes(req.params.id) && !r.requests.includes(req.params.id)) {

            await User.findByIdAndUpdate(req.params.id, {
                $push: { requests: req.user.id },
            });
            res.status(200).json("Friend request sent")
        }
    }
    catch (err) {
        next(err);
    }

}


export const rejectRequest = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { requests: req.params.id },
        });
        res.status(200).json("Friend request sent")
    }
    catch (err) {
        next(err);
    }

}

export const removeFriend = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { friends: req.params.id },
        });
        await User.findByIdAndUpdate(req.params.id, {
            $pull: { friends: req.user.id },
        });
        res.status(200).json("Friend removed")

    }
    catch (err) {
        next(err);
    }

}


export const getFriends = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        const friends = await User.find({ _id: { $in: user.friends } }).limit(20);
        res.status(200).json(friends);


    }
    catch (err) {
        next(err);
    }

}

export const random = async (req, res, next) => {
    try {
        const users = await User.find().limit(5);
        res.status(200).json(users);
    }
    catch (err) {
        next(err);
    }

}