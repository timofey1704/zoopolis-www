import React from 'react'

const Loader = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative h-12 w-12">
        {/* пульсирующие круги */}
        <div className="bg-orange/20 absolute inset-0 animate-ping rounded-full"></div>
        <div
          className="bg-orange/40 absolute inset-2 animate-ping rounded-full"
          style={{ animationDelay: '0.2s' }}
        ></div>
        <div className="bg-orange absolute inset-4 animate-pulse rounded-full"></div>
        {/* бегущий блик */}
        <div className="bg-orange-to-r animate-shimmer absolute inset-0 rounded-full from-transparent via-white/20 to-transparent"></div>
      </div>
    </div>
  )
}

export default Loader
