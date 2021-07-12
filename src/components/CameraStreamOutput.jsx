import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import CameraStreamOverlay from './CameraStreamOverlay'
import cover from 'canvas-image-cover'
import classNames from 'classnames'

const CameraStreamOutput = forwardRef(({ stream, isProcessing }, ref) => {
  const videoRef = useRef(null)
  const imageCaptureRef = useRef(null)
  const overlayRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const videoTrack = stream.getVideoTracks()[0]
    imageCaptureRef.current = new ImageCapture(videoTrack)
  }, [stream])

  useEffect(() => {
    const video = videoRef.current
    if ('srcObject' in video) {
      video.srcObject = stream
    } else {
      video.src = window.URL.createObjectURL(stream)
    }
  }, [stream])

  useEffect(() => {
    const video = videoRef.current
    if (isProcessing) {
      video.pause()
    } else {
      video.play()
    }
  }, [isProcessing])

  useImperativeHandle(ref, () => ({
    async takePhoto() {
      const canvas = canvasRef.current
      const video = videoRef.current
      const imageCapture = imageCaptureRef.current
      const contentBound = overlayRef.current.getBoundRect()

      const bitmap = await imageCapture.grabFrame()
      const scale = bitmap.width / video.videoWidth

      canvas.width = contentBound.width * scale
      canvas.height = contentBound.height * scale

      const context = canvas.getContext('2d')

      cover(
        bitmap,
        -contentBound.x * scale,
        -contentBound.y * scale,
        video.clientWidth * scale,
        video.clientHeight * scale
      ).render(context)

      return context.getImageData(0, 0, canvas.width, canvas.height)
    },
    async grabFrameCanvas() {
      const canvas = canvasRef.current
      const video = videoRef.current
      const imageCapture = imageCaptureRef.current
      const contentBound = overlayRef.current.getBoundRect()

      const bitmap = await imageCapture.grabFrame()
      const scale = bitmap.width / video.videoWidth

      canvas.width = contentBound.width * scale
      canvas.height = contentBound.height * scale

      const context = canvas.getContext('2d')

      cover(
        bitmap,
        -contentBound.x * scale,
        -contentBound.y * scale,
        video.clientWidth * scale,
        video.clientHeight * scale
      ).render(context)

      return canvas
    },
  }))

  return (
    <>
      <canvas className="hidden" ref={canvasRef}></canvas>
      <video
        className={classNames(
          'w-full h-full absolute left-0 top-0 object-cover filter transition',
          {
            grayscale: isProcessing,
          }
        )}
        ref={videoRef}
        autoPlay
        muted
      ></video>
      <CameraStreamOverlay isProcessing={isProcessing} ref={overlayRef} />
    </>
  )
})

export default CameraStreamOutput
