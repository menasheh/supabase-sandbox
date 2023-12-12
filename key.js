import KJUR from 'jsrsasign'

const JWT_HEADER = { alg: 'HS256', typ: 'JWT' }
const now = new Date()
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
const fiveYears = new Date(now.getFullYear() + 5, now.getMonth(), now.getDate())
const anonToken = `
{
  "role": "anon",
  "iss": "supabase",
  "iat": ${Math.floor(today / 1000)},
  "exp": ${Math.floor(fiveYears / 1000)}
}
`.trim()

const secret = 'super-secret-jwt-token-with-at-least-32-characters-long'

const signedJWT = KJUR.jws.JWS.sign(null, JWT_HEADER, anonToken, secret)

console.log(signedJWT);