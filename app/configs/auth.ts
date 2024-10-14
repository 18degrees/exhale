import nano from "nano"
import { AuthOptions, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { IUser } from "../interfaces/user.interface"

const DB_URI = process.env.COUCHDB_URI!

export const authConfig: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const username = credentials?.username.trim()
                    const password = credentials?.password.trim()
    
                    if (!username || !password) return null
    
                    const nanoServer = nano(DB_URI)
                
                    const usersDB: nano.DocumentScope<IUser> = nanoServer.db.use('exhale-users')
        
                    const user = await usersDB.get(username)
                    
                    const isPasswordCorrect = password === user.password
    
                    if (!isPasswordCorrect) return null
    
                    return {name: user.username} as User
                } catch (error) {
                    return null
                }
            }
        })
    ]
}