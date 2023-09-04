// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace NodeJS {
	import jwt from 'jsonwebtoken'
	export interface ProcessEnv {
		PORT: number
		MONGO_URI: string
		JWT_SECRET: jwt.Secret
		JWT_LIFETIME: number
		CREATE_ADMIN_KEY: string
	}
}