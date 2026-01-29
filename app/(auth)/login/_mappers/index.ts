import type { LoginSchemaFormData } from "../_types";
import type { LoginRequestDTO } from "../services/types";

export const toLoginRequest = (data: LoginSchemaFormData): LoginRequestDTO => {
  return {
    username: data.username,
    password: data.password,
  };
};
