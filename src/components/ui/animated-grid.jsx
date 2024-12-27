'use client'

import { useEffect, useRef } from 'react'

export default function AnimatedGrid() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const dots = []
    const dotsCount = 100
    const connectionDistance = 150
    const moveSpeed = 0.2

    class Dot {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * moveSpeed
        this.vy = (Math.random() - 0.5) * moveSpeed
      }

      move() {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1
      }
    }

    const init = () => {
      resize()
      for (let i = 0; i < dotsCount; i++) {
        dots.push(new Dot())
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
      const gridSize = 30
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Update dots
      dots.forEach(dot => dot.move())

      // Draw connections
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
      dots.forEach((dot1, i) => {
        dots.slice(i + 1).forEach(dot2 => {
          const dx = dot1.x - dot2.x
          const dy = dot1.y - dot2.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < connectionDistance) {
            ctx.beginPath()
            ctx.moveTo(dot1.x, dot1.y)
            ctx.lineTo(dot2.x, dot2.y)
            ctx.stroke()
          }
        })
      })

      // Draw dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
      dots.forEach(dot => {
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    init()
    animate()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full bg-black"
    />
  )
}

