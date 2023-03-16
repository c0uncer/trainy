const User = require('../models/User');
const Token = require('../models/Token')
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const { 
    attachCookiesToResponse,
    createTokenUser, 
    sendVerificationEmail}
    = require('../utils');
const crypto =  require('crypto');

const register = async (req, res) => {
    const { email, name, password } = req.body;

    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
        res.send({message:"Email already exists"})
        console.log("Failed")
        throw new CustomError.BadRequestError('Email already exists');
    }
        // first registered user is an admin
    try {
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const verificationToken = crypto.randomBytes(40).toString('hex');

    const user = await User.create({ name, email, password, role, verificationToken });

    const origin = 'http://localhost:5000';

    await sendVerificationEmail({
        name:user.name,
        email:user.email,
        verificationToken:user.verificationToken,
        origin
    })

    res.status(StatusCodes.CREATED).json({message: "A verification link has been sent to your email"})
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.CREATED).json({ user: tokenUser, message:"Registered Successfully!"});
    } catch (err) {
        if (err.message == "User validation failed: email: Please provide valid email"){
            res.send({message:"Please provide a valid email"})
        }
    }
    return;
};


const login = async (req,res) =>{
    const { email, password } = req.body;

    if (!email || !password) {
        res.send({message: "Please provide email and password"})
        throw new CustomError.BadRequestError('Please provide email and password');
    }
    const user = await User.findOne({ email });

    if (!user) {
        res.send({message: "Invalid Credentials"})
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        res.send({message: "Invalid Credentials"})
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    if (!user.isVerified) {
        res.send({message: "Please verify your email"})
        throw new CustomError.UnauthenticatedError('Email not verified');
    }
    try {
        const tokenUser = createTokenUser(user);

        let refreshToken = '';

        const existingToken = await Token.findOne({ user:user._id});

        if(existingToken) {
            const {isValid} = existingToken;
            if (!isValid) {
                res.send({message:"Invalid Credentials"})
                throw new CustomError.UnauthenticatedError('Invalid Credentials')
            }
            refreshToken = existingToken.refreshToken;
            attachCookiesToResponse({res, user: tokenUser, refreshToken});
            if (user.role == "admin"){
                res.status(StatusCodes.OK).json({ user: tokenUser, message:"Login Successfull!", logRole: "admin"});
                console.log("successfull")
                console.log('admin logged')
            }
            else{
                res.status(StatusCodes.OK).json({ user: tokenUser, message:"Login Successfull!", logRole: "user"});
                console.log("successfull")
                console.log('user logged')
            }
            return;
        }

        refreshToken = crypto.randomBytes(40).toString('hex');
        const userAgent = req.headers['user-agent'];
        const ip = req.ip;
        const userToken = {refreshToken, ip, userAgent, user:user._id};

        await Token.create(userToken);

        attachCookiesToResponse({ res, user:tokenUser, refreshToken});

        if (user.role == "admin"){
            res.status(StatusCodes.OK).json({ user: tokenUser, message:"Login Successfull!", logRole: "admin"});
            console.log("successfull")
            console.log("admin logged")
        }
        else{
            res.status(StatusCodes.OK).json({ user: tokenUser, message:"Login Successfull!", logRole: "user"});
            console.log("successfull")
            console.log('user logged')
        }
    } catch (error) {
        console.log(error)
    }
    return;
}
const logout = async (req,res) =>{
    await Token.findOneAndDelete({ user: req.user.userId });

    res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
    });
    res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ message: 'user logged out!', logRole: "logout" });
    console.log('logged out!')
}


module.exports = {
    register,
    login,
    logout,
    // verifyEmail
}