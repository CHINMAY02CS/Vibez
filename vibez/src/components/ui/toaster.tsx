import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastViewport } from "@/components/ui/toast";
import { Ban, CircleCheck, ShieldAlert } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              <div className="flex items-center gap-x-2">
                {props.variant === "success" && <CircleCheck className="w-4 h-4 text-green-100 fill-green-800" />}
                {props.variant === "destructive" && <Ban className="w-4 h-4" />}
                {props.variant === "warning" && <ShieldAlert className="w-4 h-4 text-orange-800 fill-orange-400" />}
                {title && <ToastDescription>{title}</ToastDescription>}
              </div>
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
