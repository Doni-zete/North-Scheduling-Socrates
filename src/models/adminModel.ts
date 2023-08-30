import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import AdminDocument from './adminDocument'

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

AdminSchema.methods.comparePassword = async function (candidatePassword: string) {
	return await bcrypt.compare(candidatePassword, this.password)
}

const Admin = mongoose.model<AdminDocument>('Admin', AdminSchema)

export default Admin