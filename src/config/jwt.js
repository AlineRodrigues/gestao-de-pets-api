const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error(
    'A variável JWT_SECRET deve ser definida no ambiente.'
  );
}

export const JWT_SECRET = jwtSecret;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';