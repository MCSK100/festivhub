import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const Button = ({ className, children, ...props }) => (
  <button 
    className={twMerge(
      'px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95',
      className
    )} 
    {...props}
  >
    {children}
  </button>
)

export { Button }
