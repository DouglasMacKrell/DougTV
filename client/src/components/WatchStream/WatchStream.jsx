import React from "react"

const WatchStream = ({ className, stream }) => {
  const setVideoRef = videoElement => {
    if (videoElement) {
      videoElement.srcObject = stream
    }
  }

  return <video className={className} autoPlay={true} ref={setVideoRef} />
}

export default WatchStream