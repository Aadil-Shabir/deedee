
interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    className?: string;
  }
  
  export function LoadingSpinner({ size = 'medium', className = '' }: LoadingSpinnerProps) {
    const sizeClasses = {
      small: 'h-4 w-4 border-t-1 border-b-1',
      medium: 'h-8 w-8 border-t-2 border-b-2',
      large: 'h-12 w-12 border-t-3 border-b-3',
    };
  
    return (
      <div className="flex justify-center">
        <div className={`animate-spin rounded-full ${sizeClasses[size]} ${className}`}></div>
      </div>
    );
  }
  