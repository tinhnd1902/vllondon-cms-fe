import BaseAPI from './base.service';
import { LoginResponse, LoginPayload } from '@/modules/auth/auth.module';

const PATH_URL = `api/auth`;

const loginRequest = async (payload: LoginPayload) => {
  localStorage.removeItem("access_token");
  return BaseAPI.POST<LoginResponse>(`${PATH_URL}/login`, payload);
};

const AuthenService = {
  loginRequest,
};

export default AuthenService;