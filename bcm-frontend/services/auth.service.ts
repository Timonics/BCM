import { api } from "@/lib/api";
import { LoginCredentials } from "@/types/auth.types";

export class AuthService {
  private static readonly BASE_URL = "/auth";

  /**
   * Admin login
   */
  static async adminLogin(credentials: LoginCredentials) {
    return await api.post(`${this.BASE_URL}/login`, credentials);
  }

  static async adminLogout() {}
}