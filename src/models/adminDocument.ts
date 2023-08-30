import { Document } from "mongoose"

interface AdminDocument extends Document {
    name: string,
    email: string,
    password: string,
    comparePassword(candidatePassword: string): Promise<boolean>
}

export default AdminDocument