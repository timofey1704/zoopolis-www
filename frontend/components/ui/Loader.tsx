import React from 'react'

const Loader = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative w-12 h-12">
        {/* пульсирующие круги */}
        <div className="absolute inset-0 rounded-full bg-orange/20 animate-ping"></div>
        <div
          className="absolute inset-2 rounded-full bg-orange/40 animate-ping"
          style={{ animationDelay: '0.2s' }}
        ></div>
        <div className="absolute inset-4 rounded-full bg-orange animate-pulse"></div>
        {/* бегущий блик */}
        <div className="absolute inset-0 rounded-full bg-orange-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
      </div>
    </div>
  )
}

export default Loader
