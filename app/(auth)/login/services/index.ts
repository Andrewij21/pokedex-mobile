import { type LoginSchemaFormData } from "@/app/(auth)/login/_types";
import { api } from "@/utils/api";
import { toLoginRequest } from "../_mappers";
import type { LoginResponseDTO } from "./types";

export const login = async (form: LoginSchemaFormData) => {
  const payload = toLoginRequest(form);
  try {
    const { data } = await api.post<LoginResponseDTO>("/auth/login", payload);
    return data;
  } catch (err) {
    throw err;
  }
};
