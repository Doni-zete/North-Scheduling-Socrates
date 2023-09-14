import { Document, ObjectId } from 'mongoose'

interface AppointmentDocument extends Document {
	instructorId: ObjectId,
	studentId: ObjectId,
	date: string,
	hour: string,
	attachments: [string]
}

export default AppointmentDocument