import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvide from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvide({
            name: 'Sign In',
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "hello@example.com"
                },
                password:{ label: 'Password', type: 'password' }
            },
            async authorize(credentials){
                if (!credentials?.email || !credentials.password){
                    return null
                }
                
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user){
                    return null
                }

                const isPasswordValid = await compare(credentials.password, user.password)

                if (!isPasswordValid){
                    return null
                }

                return {
                    id: user.id + '',
                    email: user.email,
                    name: user.name,
                    randomKey: 'Stanz ama Gatos'
                }
            }
        })
    ],
    callbacks: {
        session: ({session, token}) => {
            console.log('Session Callback', {session, token})
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    randomKey: token.randomKey
                }
            }
        },
        jwt: ({token, user}) => {
            console.log('Jwt Callback', {token, user})
            if (user) {
                const u = user as unknown as any
                return{
                    ...token,
                    id: u.id,
                    randomKey: u.randomKey
                }
            }
            return token
        }
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }