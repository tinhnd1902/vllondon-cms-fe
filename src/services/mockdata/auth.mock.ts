import { LoginResponse } from "@/modules/auth/auth.module";

// Function to generate a JWT with a 1-year expiration
const generateMockToken = () => {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const oneYearFromNow = now + (365 * 24 * 60 * 60); // Add one year in seconds

  // Payload of the token
  const payload = {
    username: "doppel",
    id: "49e65d10-e345-4337-a2fd-c3306d43123a",
    firstName: "doppel",
    lastName: "doppel",
    email: null,
    isAdmin: false,
    status: true,
    iat: now,
    exp: oneYearFromNow,
  };

  // This is a simplified example and the token is not actually signed.
  // In a real application, you would use a library like `jsonwebtoken` to sign the token.
  const mockToken = btoa(JSON.stringify(payload)); // Base64 encode the payload

  return `mock.${mockToken}.signature`; // Structure: "header.payload.signature"
};

const Login: LoginResponse = {
  access_token: generateMockToken(),
  refresh_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRvcHBlbCIsImlkIjoiNDllNjVkMTAtZTM0NS00MzM3LWEyZmQtYzMzMDZkNDMxMjNhIiwiZmlyc3ROYW1lIjoiZG9wcGVsIiwibGFzdE5hbWUiOiJkb3BwZWwiLCJlbWFpbCI6bnVsbCwiaXNBZG1pbiI6ZmFsc2UsInN0YXR1cyI6dHJ1ZSwiaWF0IjoxNzQ5NjYxODc2LCJleHAiOjE3NTAyNjY2NzZ9.d-Y6HA3hO1budjve6FxWDkHDQSkp57QBNmSnmg4zaFsWMgphdE2VX44c_GYtCyIi9R-pPd-MG6hn-tWXo3OzET6JPxnX9VlBhydj5BnYX8Ef9-6jP2C9R4IIYBiJHU0GO8Jfm2W6JWIPuKVcg3OeDqihC0INJPxh2H3xlEXw675A5_buKUqVP-CjSk9pBbAfSYtPSBIlhU8x52QE57NJrDfIu7_fANQr6GymbNMX_bHSR1ZHZkxzVY00nPnAEmxvypVz4-706WQ87Qh9PKuYYuZ9u_xsA2nZbyw-r1P9ciQp2M43WrjjTZPgKmLCPakSByuOjWOgfySBrazLvUemEw"
};

const AuthMock = {
  Login,
};

export default AuthMock;