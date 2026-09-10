import { create } from 'zustand'

export type ToastVariant = 'success' | 'error' | 'info'

export type Toast = {
  id: number
  message: string
  variant: ToastVariant
}

type ToastStore = {
  toasts: Toast[]
  showToast: (message: string, variant?: ToastVariant, duration?: number) => void
  dismissToast: (id: number) => void
}

let nextId = 1

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  showToast: (message, variant = 'info', duration = 4000) => {
    const id = nextId++
    set((state) => ({ toasts: [...state.toasts, { id, message, variant }] }))
    window.setTimeout(() => get().dismissToast(id), duration)
  },
  dismissToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
  },
}))
