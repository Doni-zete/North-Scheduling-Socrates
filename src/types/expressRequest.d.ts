declare namespace Express {
	interface Request {
		user: {
			id: string
			name: string
			role: string
		},
		files: {
			arquivo: {
				name: string
				tempFilePath: string
			}
		}
	}
}