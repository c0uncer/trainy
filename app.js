require('dotenv').config();
require('express-async-errors');
const User = require('./models/User');
const Token = require('./models/Token')
const {StatusCodes} = require('http-status-codes');
const CustomError = require('./errors');
const { 
    attachCookiesToResponse,
    createTokenUser, 
    sendVerificationEmail}
    = require('./utils');
const crypto =  require('crypto');

const path = require('path')
const cookieParser = require('cookie-parser');

//express

const express = require('express');
const app = express();

//database

const connectDB = require('./db/connect');

//routes

const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes')

//middleware

app.use(express.json());
app.use(express.static('./public'))
app.use(cookieParser(process.env.JWT_SECRET));

//ana sayfaya erişim

let roleStat = "guest";
app.post('/', (req,res,next)=>{
    const {logStat} = req.body;
    if (logStat && logStat == "admin login"){
        roleStat = "admin";
        console.log(roleStat)
    }
    else if (logStat && logStat == "user login"){
        roleStat = "user";
        console.log(roleStat)
    }
    else if (logStat && logStat == "logout"){
        roleStat = "guest";
    }
})
app.get('/', (req,res) =>{
    if(roleStat =="guest"){
        res.sendFile(path.resolve(__dirname, './pages/index.html'))
    }
    else if (roleStat == "user"){
        res.sendFile(path.resolve(__dirname, './pages/userIndex.html'))
    }
    else if (roleStat == "admin"){
        res.sendFile(path.resolve(__dirname, './pages/adminIndex.html'))
    }
    else{
        res.send(error)
    }
})

app.get('/programs', (req, res) => {
    res.sendFile(path.resolve(__dirname, './pages/programs.html'))
})
app.get('/personalized-program', (req, res) => {
    res.sendFile(path.resolve(__dirname, './pages/personalized.html'))
})
app.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname, './pages/register.html'))
})
//verify email
app.get('/verified', async (req,res)=>{
    res.sendFile(path.resolve(__dirname, './pages/verify-email.html'))
    const {token, email} = req.query;
    const user = await User.findOne({email})

    if(!user){
        throw new CustomError.UnauthenticatedError('Verification Failed')
    }

    if (user.verificationToken !== token){
        throw new CustomError.UnauthenticatedError('Verification Failed')
    }

    user.isVerified = true,
    user.verified = Date.now()
    user.verificationToken = ''

    await user.save() 

    res.status(StatusCodes.OK)
})
app.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, './pages/login.html'))
})


//auth system::

//register
// app.post('/auth/register',async (req,res)=>{
//     const { email, name, password } = req.body;

//     const emailAlreadyExists = await User.findOne({ email });
//     if (emailAlreadyExists) {
//         res.send({message:"Email already exists"})
//         console.log("Failed")
//         throw new CustomError.BadRequestError('Email already exists');
//     }
//         // first registered user is an admin
//     try {
//     const isFirstAccount = (await User.countDocuments({})) === 0;
//     const role = isFirstAccount ? 'admin' : 'user';

//     const verificationToken = crypto.randomBytes(40).toString('hex');

//     const user = await User.create({ name, email, password, role, verificationToken });

//     const origin = 'http://localhost:5000';

//     await sendVerificationEmail({
//         name:user.name,
//         email:user.email,
//         verificationToken:user.verificationToken,
//         origin
//     })

//     res.status(StatusCodes.CREATED).json({message: "A verification link has been sent to your email"})
//     const tokenUser = createTokenUser(user);
//     attachCookiesToResponse({ res, user: tokenUser });
//     res.status(StatusCodes.CREATED).json({ user: tokenUser, message:"Registered Successfully!"});
//     } catch (err) {
//         if (err.message == "User validation failed: email: Please provide valid email"){
//             res.send({message:"Please provide a valid email"})
//         }
//     }
//     return;
// })
//login
// app.post('/auth/login', async (req,res)=>{
//     const { email, password } = req.body;

//     if (!email || !password) {
//         res.send({message: "Please provide email and password"})
//         throw new CustomError.BadRequestError('Please provide email and password');
//     }
//     const user = await User.findOne({ email });

//     if (!user) {
//         res.send({message: "Invalid Credentials"})
//         throw new CustomError.UnauthenticatedError('Invalid Credentials');
//     }
//     const isPasswordCorrect = await user.comparePassword(password);
//     if (!isPasswordCorrect) {
//         res.send({message: "Invalid Credentials"})
//         throw new CustomError.UnauthenticatedError('Invalid Credentials');
//     }
//     if (!user.isVerified) {
//         res.send({message: "Please verify your email"})
//         throw new CustomError.UnauthenticatedError('Email not verified');
//     }
//     try {
//         const tokenUser = createTokenUser(user);
//         if (user.role == "admin"){
//             res.status(StatusCodes.OK).json({ user: tokenUser, message:"Login Successfull!", logRole: "admin" });
//             console.log("successfull")
//             console.log('admin logged')
//         }
//         else{
//             res.status(StatusCodes.OK).json({ user: tokenUser, message:"Login Successfull!", logRole: "user" });
//             console.log("successfull")
//             console.log('user logged')
//         }
//     } catch (error) {
//         console.log(error)
//     }
//     return;
// })
app.use('/auth', authRouter)
app.use('/users', userRouter)
        
        //run server
        
        const start = async () => {
            try {
        await connectDB(process.env.MONGO_URL)
        app.listen(5000, () => {
            console.log(`server is running or port 5000....`);
        });

    } catch (error) {
        console.log(error)
    }
}
start()