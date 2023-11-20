import { useEffect, useRef } from "react"
import "video.js/dist/video-js.css"
import videojs from 'video.js'
import { registerIVSQualityPlugin, registerIVSTech, Player } from "amazon-ivs-player"

// @ts-ignore
import wasmBinaryPath from 'amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.wasm'
// @ts-ignore
import wasmWorkerPath from 'amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.js'

const createAbsolutePath = (assetPath: string) => new URL(assetPath, document.URL).toString()

interface VideoPlayerProps {
  hlsSrc: string
}

export const VideoPlayer = (props: VideoPlayerProps) => {
  //const { registerIVSTech, registerIVSQualityPlugin } = window
  const videoRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>()

  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement("video-js")
      
      /*registerIVSTech(videojs, {
        wasmWorker: createAbsolutePath(wasmWorkerPath),
        wasmBinary: createAbsolutePath(wasmBinaryPath),
      })*/
      //registerIVSQualityPlugin(videojs)
      
      videoRef.current.appendChild(videoElement)

      playerRef.current = videojs(videoElement, {
        //techOrder: ["AmazonIVS"],
        controls: true,
        bigPlayButton: true,
        fluid: true,
        sources: [{ src: props.hlsSrc, type: "application/x-mpegURL" }],
        ...props
      })

      playerRef.current.ready(() => {
        console.log(playerRef.current)
        //playerRef.current.enableIVSQualityPlugin()
        //const ivsPlayer = playerRef.current.getIVSPlayer()
        //const PlayerEventType = playerRef.current.getIVSEvents().PlayerEventType
        /*
        ivsPlayer.addEventListener('PlayerTextMetadataCue', (cue : any) => {
          const metadataText = cue.text
          //const position = ivsPlayer.getPosition().toFixed(2)
          console.log(
              `Player Event - TEXT_METADATA_CUE: "${metadataText}". Observed ${0}s after playback started.`
          )
        })
        const els = document.getElementsByClassName("vjs-tech")
        const videoEl = els[0]
        videoEl.addEventListener('PlayerTextMetadataCue', (cue : any) => {
          const metadataText = cue.text
          console.log(
              `Player Event - TEXT_METADATA_CUE: "${metadataText}". Observed ${0}s after playback started.`
          )
        })*/
      })

    }
  }, [props])

  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
      }
    };  
  }, [playerRef])

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  )

}