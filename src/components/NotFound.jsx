import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { HiOutlineArrowLeft } from "react-icons/hi"

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-card p-12 relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />

          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-8xl md:text-9xl font-serif font-bold text-accent/20 mb-4"
          >
            404
          </motion.h1>

          <h2 className="poem-title mb-6">Lost in the margins.</h2>
          
          <p className="text-text-secondary text-lg mb-10 max-w-md mx-auto leading-relaxed">
            The verse you seek has vanished between the lines. 
            Perhaps it was never written, or simply drifted away in a dream.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/" className="btn-primary group">
              <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span>Return home</span>
            </Link>
            
            <Link to="/search" className="btn-secondary">
              Discover poetry
            </Link>
          </div>
        </motion.div>

        {/* Floating poetic fragment decoration */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.3, 0.6, 0.3] 
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="mt-8 text-text-muted font-serif italic text-sm"
        >
          "Not all those who wander are lost..."
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound
