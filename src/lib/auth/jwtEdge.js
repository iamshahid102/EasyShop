/**
 * Edge-runtime safe JWT (HS256) verification.
 *
 * The `jsonwebtoken` package relies on Node.js APIs and does NOT work inside the
 * Next.js Edge middleware runtime. Middleware therefore uses Web Crypto, which
 * is available in the Edge runtime, to verify the same HS256 tokens that
 * `jsonwebtoken` issues in the Node.js API routes.
 */

const base64UrlToUint8Array = (base64url) => {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const decodeBase64UrlJson = (base64url) =>
  JSON.parse(new TextDecoder().decode(base64UrlToUint8Array(base64url)));

/**
 * Verifies an HS256 JWT. Throws when the token is malformed, the signature is
 * invalid, or the token has expired. Returns the decoded payload on success.
 */
export const verifyTokenEdge = async (token, secret) => {
  if (!token) {
    throw new Error('No token provided');
  }
  if (!secret) {
    throw new Error('JWT secret is not configured');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token');
  }

  const [header, payload, signature] = parts;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const isSignatureValid = await crypto.subtle.verify(
    'HMAC',
    key,
    base64UrlToUint8Array(signature),
    new TextEncoder().encode(`${header}.${payload}`)
  );

  if (!isSignatureValid) {
    throw new Error('Invalid signature');
  }

  const decoded = decodeBase64UrlJson(payload);

  if (typeof decoded.exp === 'number' && Date.now() >= decoded.exp * 1000) {
    throw new Error('Token expired');
  }

  return decoded;
};
