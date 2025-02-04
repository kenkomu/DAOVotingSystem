"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

function FloatingShape({
  className,
  delay = 0,
  duration = 8,
  size = 100,
  rotate = 0,
  gradient = "from-indigo-500 to-purple-500",
}: {
  className?: string
  delay?: number
  duration?: number
  size?: number
  rotate?: number
  gradient?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: rotate - 20 }}
      animate={{ opacity: 1, scale: 1, rotate: rotate }}
      transition={{
        duration: 2,
        delay,
        ease: "easeOut",
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width: size,
          height: size,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0",
            "bg-gradient-to-br",
            gradient,
            "rounded-full opacity-70",
            "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
            "backdrop-blur-[5px] border border-white/20",
          )}
        />
      </motion.div>
    </motion.div>
  )
}

export default function DAOGeometricBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />

      <FloatingShape
        delay={0.2}
        size={200}
        rotate={15}
        gradient="from-blue-500 to-indigo-500"
        className="left-[10%] top-[20%]"
      />

      <FloatingShape
        delay={0.4}
        size={150}
        rotate={-10}
        gradient="from-purple-500 to-pink-500"
        className="right-[15%] top-[15%]"
      />

      <FloatingShape
        delay={0.6}
        size={180}
        rotate={5}
        gradient="from-green-400 to-teal-500"
        className="left-[20%] bottom-[20%]"
      />

      <FloatingShape
        delay={0.8}
        size={120}
        rotate={-20}
        gradient="from-yellow-400 to-orange-500"
        className="right-[25%] bottom-[25%]"
      />

      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
    </div>
  )
}

