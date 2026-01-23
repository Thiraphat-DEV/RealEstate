interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-6 h-6 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
}

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => {
  return (
    <div
      className={`${sizeClasses[size]} border-gold-200 border-t-gold-600 rounded-full animate-spin ${className}`}
    />
  )
}

export default Spinner
