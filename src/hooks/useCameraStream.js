import { useCallback, useEffect, useRef, useState } from 'react'

const CONSTRAINTS = {
  audio: false,
  video: {
    facingMode: 'environment',
    width: {
      min: 720,
      ideal: 1024,
    },
  },
}

const useCameraStream = ({ autoStart, torchEnabled }) => {
  const [state, setState] = useState('pending')
  const [error, setError] = useState(null)
  const streamRef = useRef({})

  const start = useCallback(() => {
    const { stream } = streamRef.current
    if (stream) {
      return
    }

    navigator.mediaDevices
      .getUserMedia(CONSTRAINTS)
      .then((stream) => {
        let torchSupported = false
        let torch = !!torchEnabled

        const videoTrack = stream.getVideoTracks()[0]

        const capabilities = videoTrack.getCapabilities()
        torchSupported = capabilities.torch

        if (torchSupported && torch) {
          stream
            .applyConstraints({ advanced: [{ torch }] })
            .then(() => {
              torch = true
            })
            .catch((err) => {
              torch = false
              console.error(err)
            })
        }

        streamRef.current = {
          stream,
          torch: torch && torchSupported,
          torchSupported,
        }
        setState('started')
      })
      .catch((err) => {
        setState('error')
        setError(err.message)
      })
  }, [streamRef, setState, setError, torchEnabled])

  const stop = useCallback(() => {
    const { stream } = streamRef.current
    if (stream) {
      for (let track of stream.getTracks()) {
        track.stop()
      }
      streamRef.current = {}
    }
    setState('stopped')
  }, [streamRef, setState])

  useEffect(() => {
    if (autoStart) {
      start()
    }
    return () => stop()
  }, [start, stop, autoStart])

  const getStreamError = useCallback(() => {
    if (state !== 'error') {
      return null
    }
    return error
  }, [state, error])

  return {
    getStreamError,
    streamState: state,
    startStream: start,
    stopStream: stop,
    getStream() {
      if (state !== 'started') {
        throw new Error(`Can't get stream, streamState is ${state}`)
      }
      const { stream } = streamRef.current
      return stream
    },
    getTorchSupport() {
      if (state !== 'started') {
        throw new Error(`Can't get TorchSupport, streamState is ${state}`)
      }
      const { torchSupported } = streamRef.current
      return torchSupported
    },
    toggleTorchMode() {
      if (state !== 'started') {
        throw new Error(`Can't set TorchMode, streamState is ${state}`)
      }

      const { stream, torch, torchSupported } = streamRef.current
      const videoTracks = stream.getVideoTracks()

      if (videoTracks.length > 0 && torchSupported) {
        const videoTrack = videoTracks[0]
        videoTrack
          .applyConstraints({ advanced: [{ torch: !torch }] })
          .then(() => {
            streamRef.current.torch = !torch
          })
          .catch((err) => {
            console.error(err)
          })
      }
    },
  }
}

export default useCameraStream
