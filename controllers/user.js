import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from '../models/user.js';

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {

        const existingUser = await User.findOne({ email })

        if (!existingUser) res.status(404).json({ message: 'User doesn\'t exist.' });

        const isPasswordCorrect = await bcrypt.compare(existingUser.password, password);

        if (!isPasswordCorrect) res.status(404).json({ message: 'Invalid credential.' });

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: '1h' });

        res.status(200).json({ result: existingUser, token });

    } catch (error) {

        console.log(error);
        res.status(500).json({ message: "Something went wrong." });

    }
}

export const signup = async (req, res) => {

    const { email, password, confirmPassword, firstName, lastName } = req.body;

    try {

        const existingUser = await User.findOne({ email })

        if (existingUser) res.status(400).json({ message: 'User Already exist.' });

        if (password != confirmPassword) res.status(400).json({ message: 'Password doesn\'t match.' });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ email, hashedPassword, name: `${firstName} ${lastName}` });

        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: '1h' });

        res.status(200).json({ result, token });

    } catch (error) {

        console.log(error);
        res.status(500).json({ message: "Something went wrong." });

    }

}