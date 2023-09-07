import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import StudentDocument from './studentDocument'
import customApiErrors from '../errors/customApiErrors'

const StudentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'The name field is required']
	},
	email: {
		type: String,
		required: [true, 'The email field is required'],
		match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Invalid email'],
		unique: [true, 'Email already exists']
	},
	password: {
		type: String,
		required: [true, 'The password field is required']
	},
	schooling: {
		type: String,
		required: [true, 'The schooling field is required']
	},

})

StudentSchema.pre('save', async function (next) {
	if (this.password) {
		const salt = await bcrypt.genSalt(10)
		this.password = await bcrypt.hash(this.password, salt)
	}
	next()
})

StudentSchema.pre('findOneAndUpdate', async function (next) {
	if (this.get('password')) {
		const newPassword = this.get('password')
		const oldPassword = this.get('oldPassword')
		if (!oldPassword || (newPassword === oldPassword)) {
			throw new customApiErrors.BadRequestError('Please provide a valid password and old password')
		}

		const student = await Student.findById(this.getQuery()._id)
		if (!student) {
			throw new customApiErrors.BadRequestError('Please provide a valid student id')
		}

		const isSameOldPassword = await student.comparePassword(this.get('oldPassword'))
		if (!isSameOldPassword) {
			throw new customApiErrors.BadRequestError('Please provide a valid oldPassword')
		}

		const isSamePassword = await student.comparePassword(newPassword)
		if (isSamePassword) {
			throw new customApiErrors.BadRequestError('This new password is the same as the current password, try again!')
		}

		const salt = await bcrypt.genSalt(10)
		const passHashed = await bcrypt.hash(newPassword, salt)
		this.set('password', passHashed)
	}
	next()
})

StudentSchema.methods.comparePassword = async function (candidatePassword: string) {
	return await bcrypt.compare(candidatePassword, this.password)
}

const Student = mongoose.model<StudentDocument>('Students', StudentSchema)

export default Student