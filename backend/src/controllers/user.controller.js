const userRepository = require('../repositories/user.repository');
const baseResponse = require('../utils/baseResponse.util');
const bcrypt = require('bcrypt');

const saltRounds = 10;

exports.registerUser = async (req, res) => {
    try{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let emailValid = emailRegex.test(req.query.email);
        const passRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
        let passValid = passRegex.test(req.query.password);

        if(emailValid === false || passValid === false){
            baseResponse(res, false, 400, "Please Input a valid email, and Password must be 8 bit long, contain at least one number and one special character");
        } else {
            const hash = bcrypt.hashSync(req.query.password, saltRounds);
            const user = await userRepository.registerUser(req.query, hash);
            if(!user){
                baseResponse(res, false, 400, "Email already used");
            } else{
            baseResponse(res, true, 201, "User created", user);
            }
        }
    } catch(error){
        baseResponse(res, false, 500, "An error occurred while creating user", error);
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.query; // atau req.body jika POST JSON

        // Validasi input
        if (!email || !password) {
            return baseResponse(res, false, 400, "Please input email and password");
        }

        const user = await userRepository.loginUser({ email });

        if (!user) {
            return baseResponse(res, false, 400, "Invalid email or password");
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return baseResponse(res, false, 400, "Invalid password");
        }

        return baseResponse(res, true, 200, "Login Success", user);
    } catch (error) {
        console.log(error);
        return baseResponse(res, false, 500, "An error occurred while logging in", error);
    }
};


exports.findUser = async (req, res) => {
    try{
        const user = await userRepository.findUser(req.params.id);
        if(!user){
            baseResponse(res, false, 404, "User not found");
        } else{
            baseResponse(res, true, 200, "User found", user);
        }
    } catch(error){
        baseResponse(res, false, 500, "An error occurred while fetching user", error);
    }
};