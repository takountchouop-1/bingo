import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { useToastStore } from '../../stores/toaststore'
import './Toast.css'

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts)
  const dismissToast = useToastStore((state) => state.dismissToast)

  if (toasts.length === 0) return null

  return (
    <div className="toast-viewport" role="status" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = icons[toast.variant]
        return (
          <div key={toast.id} className={`toast toast-${toast.variant}`}>
            <Icon size={18} aria-hidden="true" />
            <span className="toast-message">{toast.message}</span>
            <button type="button" className="toast-close" onClick={() => dismissToast(toast.id)} aria-label="Dismiss notification">
              <X size={15} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default ToastViewport
