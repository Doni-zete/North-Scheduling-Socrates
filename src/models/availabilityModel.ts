import mongoose from 'mongoose'
import AvailabilityDocument from './availabilityDocument'
import customApiErrors from '../errors/customApiErrors'


const AvailabilitySchema = new mongoose.Schema({
	instructorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Instructor',
		required: true,
		immutable: true
	},
	date: {
		type: String, // "2023-09-01 - AAAA-MM-DD"
		required: [true, 'The date field is required'],
		immutable: true,
		match: [/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, 'Invalid date']
	},
	hours: {
		type: [String], // ["09:00", "10:00", "14:00" - HH:MM]
		required: [true, 'The hours field is required'],
		validate: {
			validator: function (hours: string[]) {
				if (hours.length === 0 || !hours) {
					return false
				}
				const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
				for (const hour of hours) {
					if (!regex.test(hour)) {
						return false
					}
				}
				return true
			}, message: 'Invalid hours'
		}
	}
})


AvailabilitySchema.pre('findOneAndUpdate', async function (next) {
	if (this.get('date')) {
		throw new customApiErrors.BadRequestError('You can\'t update date field')
	} else if (this.get('_id')) {
		throw new customApiErrors.BadRequestError('You can\'t update _id field')
	} else if (this.get('instructorId')) {
		throw new customApiErrors.BadRequestError('You can\'t update instructorId field')
	}
	next()
})

const Availability = mongoose.model<AvailabilityDocument>('Availability', AvailabilitySchema)

export default Availability