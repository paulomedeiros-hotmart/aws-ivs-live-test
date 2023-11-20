import { FC, useEffect, useRef } from "react"

interface VideoPlayerProps {
  hlsSrc: string
}

export const NativeJsPlayer = (props : VideoPlayerProps) => {
  const { 
    registerIVSTech, 
    registerIVSQualityPlugin,
    videojs } = window
  const playerRef = useRef<any>()

  useEffect(() => {
    if (!playerRef.current) {      
      //registerIVSTech(videojs)
      //registerIVSQualityPlugin(videojs)

      playerRef.current = videojs("video-js", {
        //techOrder: ["AmazonIVS"],
        controls: true,
        bigPlayButton: true,
        fluid: true,
        sources: [{ src: props.hlsSrc, type: "application/x-mpegURL" }],
        controlBar: {
            pictureInPictureToggle: false // Hides the PiP button
        }
      });

      playerRef.current.ready(() => {
        //playerRef.current.enableIVSQualityPlugin()
        //playerRef.current.src(props.hlsSrc)
        //const ivsPlayer = playerRef.current.getIVSPlayer()
        //const PlayerEventType = playerRef.current.getIVSEvents().PlayerEventType
    })

    }
  }, [props])

  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player) {
        //player.dispose()
      }
    };
  }, [playerRef])

  return (
    <div className="video-wrapper">
      <div id="video-js" className="video-js vjs-fluid vjs-big-play-centered"></div>
    </div>
  )
}
