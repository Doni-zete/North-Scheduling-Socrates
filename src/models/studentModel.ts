import mongoose from "mongoose";

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

const student = mongoose.model('Students', StudentSchema)

export default student