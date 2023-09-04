import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import AdminDocument from './adminDocument'
import customApiErrors from '../errors/customApiErrors'

const AdminSchema = new mongoose.Schema({
	name: {
		type: String, required: [true, 'Enter your name']
	},
	email: {
		type: String,
		required: [true, 'Please provide an email'],
		match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email'],
		unique: [true, 'Email already exists']
	},
	password: {
		type: String, required: [true, 'Enter your password']
	}
})

AdminSchema.pre('save', async function (next) {
	if (this.password) {
		const salt = await bcrypt.genSalt(10)
		this.password = await bcrypt.hash(this.password, salt)
	}
	next()
})

AdminSchema.pre('findOneAndUpdate', async function (next) {
	if (this.get('password')) {
		const newPassword = this.get('password')
		const oldPassword = this.get('oldPassword')
		if (!oldPassword || (newPassword === oldPassword)) {
			throw new customApiErrors.BadRequestError('Please provide a valid password and old password')
		}

		const admin = await Admin.findById(this.getQuery()._id)
		if (!admin) {
			throw new customApiErrors.BadRequestError('Please provide a valid admin id')
		}

		const isSameOldPassword = await admin.comparePassword(this.get('oldPassword'))
		if (!isSameOldPassword) {
			throw new customApiErrors.BadRequestError('Please provide a valid oldPassword')
		}

		const isSamePassword = await admin.comparePassword(newPassword)
		if (isSamePassword) {
			throw new customApiErrors.BadRequestError('This new password is the same as the current password, try again!')
		}

		const salt = await bcrypt.genSalt(10)
		const passHashed = await bcrypt.hash(newPassword, salt)
		this.set('password', passHashed)
	}
	next()
})

AdminSchema.methods.comparePassword = async function (candidatePassword: string) {
	return await bcrypt.compare(candidatePassword, this.password)
}

const Admin = mongoose.model<AdminDocument>('Admin', AdminSchema)

export default Admin