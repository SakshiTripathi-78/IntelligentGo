import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { rateLimiter } from './middlewares/rateLimiter.js'
import routeRouter from './routes/route.js'
import morgan from 'morgan'
import redis from './config/redis.js'


dotenv.config()

const app = express()
app.set('trust proxy', 1)
app.use(cors({
    origin: [
        'http://localhost:5173',
    'https://intelligent-go.vercel.app' // ← add your Vercel URL
    ]
}))
app.use(morgan('dev')) // basically used for a better debugging.Logs every request to terminal.
app.use(express.json()) // Parse jason request bodies.
app.use(rateLimiter) //rate limit all routes.


app.use('/api', routeRouter)

app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        service: 'Fuel Optimization API',
        routes: ['/health', '/api/route']
    })
})

app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

const PORT = process.env.PORT || 3000
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

export default app
