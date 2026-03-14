import { createRemoteJWKSet, decodeJwt, jwtVerify } from 'https://esm.sh/jose@5.6.3'

const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>()

export type ClerkJwt = {
  sub: string
  iss?: string
  [key: string]: unknown
}

export async function verifyClerkAuthHeader(authHeader: string | null): Promise<ClerkJwt> {
  if (!authHeader) {
    throw new Error('Unauthorized')
  }

  const token = authHeader.replace('Bearer ', '').trim()
  if (!token) {
    throw new Error('Unauthorized')
  }

  // Decode first to discover issuer.
  const decoded = decodeJwt(token) as ClerkJwt
  const iss = typeof decoded.iss === 'string' ? decoded.iss : undefined
  if (!iss) {
    throw new Error('Invalid token')
  }

  let jwks = jwksCache.get(iss)
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(`${iss.replace(/\/$/, '')}/.well-known/jwks.json`))
    jwksCache.set(iss, jwks)
  }

  const { payload } = await jwtVerify(token, jwks)

  const sub = typeof payload.sub === 'string' ? payload.sub : ''
  if (!sub) {
    throw new Error('Invalid token')
  }

  return payload as ClerkJwt
}
