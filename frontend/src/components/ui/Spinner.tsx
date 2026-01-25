interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-12 h-12',
  lg: 'w-12 h-12',
}

// Polygon loader with amber color - rotating hexagons
export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => {
  return (
    <>
      <style>
        {`
          @keyframes polygon-spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          .polygon-spin {
            animation: polygon-spin 2s linear infinite;
            transform-origin: 30px 30px;
          }
          .polygon-spin-reverse {
            animation: polygon-spin 1.5s linear infinite reverse;
            transform-origin: 30px 30px;
          }
          .polygon-spin-fast {
            animation: polygon-spin 1s linear infinite;
            transform-origin: 30px 30px;
          }
        `}
      </style>
      <div className={`${sizeClasses[size]} ${className} inline-block relative`}>
        <svg
          className="w-full h-full"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer hexagon - rotates clockwise */}
          <g className="polygon-spin">
            <polygon
              points="30,6 48,15 48,45 30,54 12,45 12,15"
              stroke="rgb(251, 191, 36)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="rgba(251, 191, 36, 0.1)"
            />
          </g>
          {/* Middle hexagon - rotates counter-clockwise */}
          <g className="polygon-spin-reverse">
            <polygon
              points="30,15 42,21 42,39 30,45 18,39 18,21"
              stroke="rgb(245, 158, 11)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="rgba(245, 158, 11, 0.15)"
            />
          </g>
          {/* Inner hexagon - rotates clockwise */}
          <g className="polygon-spin-fast">
            <polygon
              points="30,21 37.5,25.5 37.5,34.5 30,39 22.5,34.5 22.5,25.5"
              stroke="rgb(217, 119, 6)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="rgba(217, 119, 6, 0.2)"
            />
          </g>
          {/* Center dot */}
          <circle
            cx="30"
            cy="30"
            r="3.5"
            fill="rgb(251, 191, 36)"
            className="animate-pulse"
          />
        </svg>
      </div>
    </>
  )
}

export default Spinner
