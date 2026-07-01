import jwt from 'jsonwebtoken'

export const generateToken = (userId: string) => {
  const config = useRuntimeConfig()
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '24h' })
}

export const verifyToken = (token: string) => {
  const config = useRuntimeConfig()
  try {
    return jwt.verify(token, config.jwtSecret)
  } catch (e) {
    return null
  }
}
