export interface LoginRequestDTO {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface LoginResponseDTO {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}
