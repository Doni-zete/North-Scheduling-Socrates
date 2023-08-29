import { Document } from "mongoose"

interface StudentDocument extends Document {
    name: string,
    email: string,
    password: string,
    schooling: string,
    comparePassword(candidatePassword: string): Promise<boolean>
}

export default StudentDocument