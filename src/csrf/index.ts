import { doubleCsrf } from 'csrf-csrf';

export * from './csrf.guard';

// TODO: move to dedicated module
export const {
  invalidCsrfTokenError,
  generateToken,
  validateRequest, // Also a convenience if you plan on making your own middleware.
  doubleCsrfProtection, // This is the default CSRF protection middleware.
} = doubleCsrf({
  getSecret: (_req) => 'return some cryptographically pseudorandom secret here',
  getSessionIdentifier: (req) => req.cookies['nest.session-token'], // return the requests unique identifier,
  cookieName:
    process.env.NODE_ENV === 'production' ? undefined : 'nest.csrf-token',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
