import toast from 'react-hot-toast'
import { ToastProps } from '@/app/types'

const toastStyles = {
  success: {
    background: 'bg-green-50',
    text: 'text-green-800',
    border: 'border-green-200',
  },
  error: {
    background: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200',
  },
  loading: {
    background: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
}

const showToast = ({ type, message, action, duration }: ToastProps) => {
  const styles = toastStyles[type]

  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-slideIn' : 'animate-slideOut'
        }  shadow-lg rounded-2xl px-3 pointer-events-auto ${
          styles.background
        } ${
          styles.border
        } border transform transition-all duration-300 ease-in-out`}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-1">
              <p className={`text-sm font-medium ${styles.text}`}>{message}</p>
              {action && (
                <div className="text-center">
                  <button
                    onClick={action.onClick}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    {action.text}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    { duration: duration || 4000 }
  )
}

export default showToast

//пример использования: showToast({ type: 'error', message: 'Неверный email или пароль' })
