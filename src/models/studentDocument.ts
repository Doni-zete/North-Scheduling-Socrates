import { Document } from "mongoose";

export interface studentDocument extends Document {
    name: string,
    email: string,
    password: string,
    schooling: string,
    comparePassword (candidatePassword:string): Promise<boolean>
}