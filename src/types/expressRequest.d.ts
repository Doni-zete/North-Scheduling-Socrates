declare namespace Express {
	import fileUpload from 'express-fileupload'
	interface Request {
		user: {
			id: string
			name: string
			role: string
		},
		files: fileUpload[]
	}
}