import jwt from 'jsonwebtoken';

export const generateToken = (userId, role = 'user') => {
  return jwt.sign(
    {
      userId: userId,  // Changed from 'id' to 'userId' for consistency
      role: role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const setTokenCookie = (token) => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    'Set-Cookie': `token=${token}; HttpOnly; ${isProduction ? 'Secure;' : ''} SameSite=Strict; Max-Age=${30 * 24 * 60 * 60}; Path=/`,
  };
};
