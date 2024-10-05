import { DecodedIdToken } from 'firebase-admin/auth'; // Import the type for Firebase decoded token

declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken; // Add the user property
    }
  }
}
