import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const StudentSchema = new mongoose.Schema({
    name: {
        type: String, required: [true, 'Enter your name']
    },
    email: {
        type: String, required: [true, 'Enter your email'],
    },
    password: {
        type: String, required: [true, 'Enter your password']
    },
    schooling: {
        type: String, required: [true, 'Enter your schooling']
    },

})

StudentSchema.pre('save', async function(next){
    if (this.password){
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    }
    next()
})

const student = mongoose.model('Students', StudentSchema)

export default student