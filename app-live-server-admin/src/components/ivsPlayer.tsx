import { useEffect, useRef } from "react"
import { create, ErrorType, MediaPlayer, PlayerError, PlayerEventType, PlayerState, Quality, TextCue, TextMetadataCue } from "amazon-ivs-player"

// @ts-ignore
import wasmBinaryPath from 'amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.wasm'
// @ts-ignore
import wasmWorkerPath from 'amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.js'

const createAbsolutePath = (assetPath: string) => new URL(assetPath, document.URL).toString()

interface VideoPlayerProps {
  hlsSrc: string
}

export const IvsPlayer = (props: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<MediaPlayer>()

  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      playerRef.current = create({
        wasmWorker: createAbsolutePath(wasmWorkerPath),
        wasmBinary: createAbsolutePath(wasmBinaryPath),
      })

      playerRef.current.attachHTMLVideoElement(videoRef.current)
      attachListeners()
      playerRef.current.setAutoplay(true)
      playerRef.current.load(props.hlsSrc)
    }
  }, [props])

  const attachListeners = () => {
    const player = playerRef.current
    if (player) {
      for (let state of Object.values(PlayerState)) {
        player.addEventListener(state, () => {
          console.log(state);
        });
      }
  
      player.addEventListener(PlayerEventType.INITIALIZED, () => {
        console.log('INITIALIZED');
      });
  
      player.addEventListener(PlayerEventType.ERROR, (error: PlayerError) => {
        const statusTooManyRequests = 429;
        if (
          error.type === ErrorType.NOT_AVAILABLE &&
          error.code === statusTooManyRequests
        ) {
          console.error('Concurrent-viewer limit reached', error);
        } else {
          console.error('ERROR', error);
        }
      });
  
      player.addEventListener(
        PlayerEventType.QUALITY_CHANGED,
        (quality: Quality) => {
          console.log('QUALITY_CHANGED', quality);
        }
      );
  
      // This event fires when text cues are encountered, such as captions or subtitles
      player.addEventListener(PlayerEventType.TEXT_CUE, (cue: TextCue) => {
        console.log('TEXT_CUE', cue.startTime, cue.text);
      });
  
      // This event fires when embedded Timed Metadata is encountered
      player.addEventListener(
        PlayerEventType.TEXT_METADATA_CUE,
        (cue: TextMetadataCue) => {
          console.log('Timed metadata', cue.text);
        }
      );
    }
  }

  return (
    <div>
      <video ref={videoRef} />
    </div>
  )

}