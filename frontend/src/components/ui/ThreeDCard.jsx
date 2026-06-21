import React, { useState, useRef } from 'react'

/**
 * ThreeDCard applies a premium 3D tilt effect on hover based on mouse position.
 */
const ThreeDCard = ({ children, className = '' }) => {
  const cardRef = useRef(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    
    // Get mouse position relative to card boundaries
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Calculate values normalized between -0.5 and 0.5
    const normalizedX = (x / rect.width) - 0.5
    const normalizedY = (y / rect.height) - 0.5
    
    const maxTilt = 12 // Maximum degrees of tilt rotation
    
    // Set rotation angles
    setRotateY(normalizedX * maxTilt)
    setRotateX(-normalizedY * maxTilt)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-300 ease-out preserve-3d ${className}`}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transformStyle: 'preserve-3d'
      }}
    >
      <div className="h-full w-full preserve-3d">
        {children}
      </div>
    </div>
  )
}

export default ThreeDCard
