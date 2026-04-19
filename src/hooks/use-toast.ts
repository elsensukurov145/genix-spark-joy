// Re-export sonner toast for compatibility with components that import from @/hooks/use-toast
import { toast as sonnerToast } from "sonner";

type ToastOpts = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export const toast = (opts: ToastOpts | string) => {
  if (typeof opts === "string") return sonnerToast(opts);
  const { title, description, variant } = opts;
  if (variant === "destructive") {
    return sonnerToast.error(title ?? "Xəta", { description });
  }
  return sonnerToast(title ?? "", { description });
};

export const useToast = () => ({ toast });
