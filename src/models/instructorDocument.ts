import { Document } from 'mongoose'

interface InstructorDocument extends Document {
	name: string,
	email: string,
	password: string,
	specialities: string[],
	comparePassword(candidatePassword: string): Promise<boolean>,
}

export default InstructorDocument