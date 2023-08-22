import mongoose from 'mongoose'

const instructorSchema = new mongoose.Schema({
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
        enum: ['presential', 'Online'],
        required: [true, 'Please provide your form of service']
    },
    classStartTime:{
        type: Date,
        required: [true, 'Please provide the start time of the class']
    },
    classTime:{
        type: Number,
        required: [true, 'Please provide the time of each class']
    },
    classLocation: {
        type: String
    },
    email:{
        type: String,
        required:[true, 'Please provide an email'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'Please provide a password'],
    }
})

instructorSchema.pre('save', function(next) {
    if (this.formOfService === 'presential') {
        if (!this.classLocation){
            return next(new Error('Local is required for presential service'))
        }
    }
    next()
})