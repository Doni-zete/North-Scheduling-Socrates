import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'


const app = express()

async function start() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database connected!')
    
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}!`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()