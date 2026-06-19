"use client";

import { AuthProvider } from "./auth-provider";
import { CartProvider } from "./cart-provider";
import ChunkReloadRecovery from "./chunk-reload-recovery";
import { ToastProvider } from "./toast-provider";

export default function AppProviders({ children }) {
  return (
    <ToastProvider>
      <ChunkReloadRecovery />
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
