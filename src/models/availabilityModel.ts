import mongoose from 'mongoose'
import AvailabilityDocument from './availabilityDocument'


const AvailabilitySchema = new mongoose.Schema({
	instructorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Instructor',
		require: true
	},

	date: {
		type: String, // "2023-09-01 - AAAA-MM-DD"
		required: [true, 'The date field is required']
	},

	hours: {
		type: [String], // ["09:00", "10:00", "14:00" - HH:MM]
		required: [true, 'The hours field is required']
	}
})


const Availability = mongoose.model<AvailabilityDocument>('Availability', AvailabilitySchema)

export default Availability