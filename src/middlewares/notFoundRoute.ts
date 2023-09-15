import express from 'express'

export default function notFoundRoute(req: express.Request, res: express.Response) {
	res.status(404).json({ msg: 'Whoops, looks like this route does not exist. Go back to the main page!' })
} 
