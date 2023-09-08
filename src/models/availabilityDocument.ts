import { Document, ObjectId } from 'mongoose'

interface AvailabilityDocument extends Document {
	instructorId: ObjectId
	date: string
	hours: string[]
}

export default AvailabilityDocument