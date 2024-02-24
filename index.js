import express from 'express'

import { config } from 'dotenv'

import cors from 'cors'
import connectionToDB from './dbConnection.js'
import router from './Routes/user.route.js'

const app = express()
const PORT = process.env.PORT || 5000

config()

app.listen(PORT, async () => {
	await connectionToDB()
	console.log(`App is running at http://localhost:${PORT}`)
})

app.use(express.json())
app.use(
	cors({
		origin: '*',
		credentials: true, // Cookie can move easily
	})
)

app.use('/ping', function (req, res) {
	// to check whether our server is up or not with bare configurations
	res.send('/pong')
})

// app.all('*', (req, res) => {
// 	// random url
// 	res.status(404).send('OOPS!! 404 page not found')
// })

app.use('/', router)

// app.use(errorMiddleware);

export default app
