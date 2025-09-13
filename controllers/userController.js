import bcrypt from "bcryptjs";
import { User } from "../models/user.js"
const isProduction = process.env.NODE_ENV === "production";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res
            .cookie("token", token, {
                httpOnly: true,
                sameSite: isProduction ? "none" : "strict",
                secure: isProduction,
                maxAge: 30 * 24 * 60 * 60 * 1000
            })
            .status(200)
            .json({
                message: "Login successful",
                user: {
                    name: user.name,
                    email: user.email,
                },
            });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

export const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please send all credentials" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashPassword,
        });
        const savedUser = await user.save();

        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        res
            .cookie("token", token, {
                httpOnly: true,
                sameSite: isProduction ? "none" : "strict",
                secure: isProduction,
                maxAge: 30 * 24 * 60 * 60 * 1000
            })
            .status(201)
            .json({
                message: "Signup successful",
                user: {
                    name: savedUser.name,
                    email: savedUser.email,
                },
            });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

export const logoutUser = (req, res) => {
    try {
      res.cookie("token", "", {
          httpOnly: true,
          sameSite: "strict",
          expires: new Date(0),
          path: "/",
        })
        .status(200)
        .json({ message: "Logout successful" });

    } catch (error) {
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

export const getUser = async (req, res, next) => {   
    try {
        if (!req.user) {
            return res.status(400).json({ message: "User not found" })
        }
        
        const user = await User.findOne({ _id: req.user.id }).select("-password");
        if (!user) {
            return res.status(400).json({ message: "User does not exist" })
        }

        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
};