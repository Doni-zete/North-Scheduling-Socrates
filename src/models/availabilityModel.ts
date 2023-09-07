import mongoose from 'mongoose'
import AvailabilityDocument from './availabilityDocument'


const AvailabilitySchema = new mongoose.Schema({
	instructorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Instructor',
		required: true
	},
	date: {
		type: String, // "2023-09-01 - AAAA-MM-DD"
		required: [true, 'The date field is required'],
		match: [/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, 'Invalid date']
	},
	hours: {
		type: [String], // ["09:00", "10:00", "14:00" - HH:MM]
		required: [true, 'The hours field is required'],
		validate: {
			validator: function (hours: string[]) {
				const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
				for (const hour of hours) {
					if (!regex.test(hour)) {
						return false
					}
				}
				return true
			}, message: 'Invalid hour'
		}
	}
})


const Availability = mongoose.model<AvailabilityDocument>('Availability', AvailabilitySchema)

export default Availability