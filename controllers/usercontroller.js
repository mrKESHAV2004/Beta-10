import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import userModel from '../models/userModel.js'

const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

const loginUser = async (req,res) =>{
    try{
        const {email,password} = req.body;
        const user = await userModel.findOne({email});
        if (!user){
            return res.json({ success: false, message: "User doesn' t exists" })
        }
        const isMatch = await bcrypt.compare(password,user.password);
        
        if (isMatch){
            const token = createToken(user._id)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:'Invalid Credentials'})
        }
    }catch(error){
        console.log(error)
        res.json({ success: false, message:error.message})
    }
}


const registerUser = async (req, res) => {
    try {
        const { name, email,type ,password } = req.body

        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong password (at least 8 characters)" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            type,
            password: hashedPassword
        })
        const user = await newUser.save()
        const token = createToken(user._id)

        res.json({ success: true, token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Server error, please try again later." })
    }
}



export { loginUser, registerUser }

