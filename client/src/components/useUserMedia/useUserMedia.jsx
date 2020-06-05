import { useState, useEffect } from "react"
// import useSocket from 'use-socket.io-client';


const useUserMedia = requestedMedia => {
  const [mediaStream, setMediaStream] = useState(null);

  // initialize streams
  useEffect(() => {
    const enableStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(requestedMedia);
        setMediaStream(stream);
      } catch(err) {
        console.log(err)
      }
    }

    if (!mediaStream) {
      enableStream();
    } else {
      return function cleanup() {
        mediaStream.getTracks().forEach(track => {
          track.stop();
        });
      }
    }
  }, [mediaStream, requestedMedia]);

  return mediaStream;
}

export default useUserMedia