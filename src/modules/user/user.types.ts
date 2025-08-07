export interface RegisterUserBody {
  name: string;
  phone: number;
  email: string;
  password: string;
}

export interface LoginUserBody {
  email: string;
  password: string;
}
