export interface HttpResponse<T extends object> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export enum ROLE {
  ADMIN = "admin",
  DRIVER = "driver",
}

export interface LoginResponse {
  accessToken: string;
  userData: {
    email: string;
    full_name: string;
    id: string;
    role: ROLE;
  };
}

export enum VERIFICATION_STATUS {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
