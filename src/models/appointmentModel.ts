import mongoose from 'mongoose'
import AppointmentDocument from './appointmentDocument'
import customApiErrors from '../errors/customApiErrors'

const appointmentSchema = new mongoose.Schema({
	instructorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Instructor',
		required: [true, 'The instructorId field is required']
	},
	studentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Student',
		required: [true, 'The studentId field is required']
	},
	subject: {
		type: String,
		required: [true, 'The subject field is required']
	},
	date: {
		type: String,
		required: [true, 'The date field is required'],
		match: [/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, 'Invalid date']
	},
	hour: {
		type: String,
		required: [true, 'The hour field is required'],
		match: [/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid hour']
	},
	attachments: {
		type: [String],
	}
})

appointmentSchema.pre('findOneAndUpdate', async function (next) {
	if (this.get('date')) {
		throw new customApiErrors.BadRequestError('You can\'t update date field')
	} else if (this.get('_id')) {
		throw new customApiErrors.BadRequestError('You can\'t update _id field')
	} else if (this.get('instructorId')) {
		throw new customApiErrors.BadRequestError('You can\'t update instructorId field')
	} else if (this.get('studentId')) {
		throw new customApiErrors.BadRequestError('You can\'t update studentId field')
	} else if (this.get('hour')) {
		throw new customApiErrors.BadRequestError('You can\'t update hour field')
	}
	next()
})




const Appointment = mongoose.model<AppointmentDocument>('Appointment', appointmentSchema)

export default Appointment