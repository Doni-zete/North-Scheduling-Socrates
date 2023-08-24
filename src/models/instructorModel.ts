import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import InstructorDocument from './instructorDocument'

const InstructorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name']
    },
    specialities: [{
        type: String,
        required: [true, 'Please provide your speciality']
    }],
    availableTime: {
        type: String,
        required: [true, 'Please provide your available time']
    },
    formOfService: {
        type: String,
        enum: ['presential', 'online'],
        required: [true, 'Please provide your form of service']
    },
    classStartTime: {
        type: Date,
        required: [true, 'Please provide the start time of the class']
    },
    classTime: {
        type: Number,
        required: [true, 'Please provide the time of each class']
    },
    classLocation: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    }
})

InstructorSchema.pre('save', async function (next) {
    if (this.password) {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    }
    next()
})

InstructorSchema.methods.createJWT = async function () {
    const jwtSecret = process.env.JWT_SECRET
    return jwt.sign({ usedId: this._id, name: this.name }, jwtSecret, { expiresIn: process.env.JWT_LIFETIME }
    )
}

InstructorSchema.methods.comparePassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password)
}

const Instructor = mongoose.model<InstructorDocument>('Instructor', InstructorSchema)

export default Instructor