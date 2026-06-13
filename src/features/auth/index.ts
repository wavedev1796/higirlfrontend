/**
 * Auth feature — public API.
 *
 * Barrel file that exposes the feature's public interface.
 * Other modules should only import from this file.
 */

// Components
export { LoginForm } from "./components/LoginForm";
export { LoginView } from "./components/LoginView";
export { RegisterForm } from "./components/RegisterForm";
export { RegisterView } from "./components/RegisterView";
export { ProtectedRoute } from "./components/ProtectedRoute";

// Providers
export { AuthProvider, useAuthStore } from "./providers/AuthProvider";

// Hooks
export { useLogin } from "./hooks/useLogin";
export { useRegister } from "./hooks/useRegister";

// Types
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "./types";
