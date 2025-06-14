import BaseAPI from './base.service';
import { LoginResponse, LoginPayload } from '@/modules/auth/auth.module';
import LoginMock from './mockdata/auth.mock';

const PATH_URL = `api/auth`;

const loginRequest = async (payload: LoginPayload) => {
  localStorage.removeItem("access_token");
  return BaseAPI.POST<LoginResponse>(`${PATH_URL}/login`, payload);
  // return LoginMock.Login
};

const AuthenService = {
  loginRequest,
};

export default AuthenService;