import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { AuthResponse, LoginCredentials } from "@/types/auth.types";

// Query keys for React Query caching
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await AuthService.adminLogin(credentials);

      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }

      return response;
    },
    onSuccess: (response) => {
      if (response.success && response.data?.accessToken) {
        // Set cookie
        Cookies.set("token", response.data.accessToken, {
          expires: 7,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        // Store user data in query cache
        queryClient.setQueryData(authKeys.user(), response.data.user);

        // Show success toast
        toast.success(
          `Welcome back, ${response.data.user.fullName || "User"}!`,
        );

        // Redirect
        router.push("/welcome");
      }
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Login failed. Please check your credentials.",
      );
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const token = Cookies.get("token");
      if (token) {
        // await AuthService.logout().catch(() => {
        //   // Silently fail if logout endpoint fails
        //   console.warn('Logout endpoint failed');
        // });
      }
      return true;
    },
    onSuccess: () => {
      // Clear cookie
      Cookies.remove("token", { path: "/" });

      // Clear all query cache
      queryClient.clear();

      // Show success toast
      toast.success("Logged out successfully");

      // Redirect to login
      router.push("/auth/login");
    },
    onError: (error: Error) => {
      toast.error("Logout failed. Please try again.");
      console.error("Logout error:", error);
    },
  });

  return {
    // Login
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    isLoginSuccess: loginMutation.isSuccess,

    // Logout
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    logoutError: logoutMutation.error,
    isLogoutSuccess: logoutMutation.isSuccess,
  };
};
