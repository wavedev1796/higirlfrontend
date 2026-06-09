export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  rol: string;
};

export type LoginResponse = {
  message?: string | string[];
  mensaje?: string;
  token?: string;
  usuario?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
};

export type RegisterResponse = {
  message?: string | string[];
  mensaje?: string;
};
