import {Document} from 'mongoose'

interface InstructorDocument extends Document {
    name: string,
    specialities: string[],
    availableTime: string,
    formOfService: string,
    classStartTime: Date,
    classTime: number,
    classLocation: string,
    email: string,
    password: string,
    comparePassword (candidatePassword:string): Promise<boolean>,
    createJWT():Promise<string>
}

export default InstructorDocument