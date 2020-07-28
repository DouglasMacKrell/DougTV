import React from "react";

const BroadcastStream = ({ className, stream }) => {
  const setVideoRef = (videoElement) => {
    if (videoElement) {
      videoElement.srcObject = stream;
    }
  };

  return (
    <video className={className} autoPlay={true} muted ref={setVideoRef} />
  );
};

export default BroadcastStream;
