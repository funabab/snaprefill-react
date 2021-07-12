import { useContext, useEffect, useRef, useState } from 'react'
import useCameraStream from '../hooks/useCameraStream'
import useTesseract from '../hooks/useTesseract'
import CameraActionButton from './CameraActionButton'
import CameraStreamOutput from './CameraStreamOutput'
import Loading from './Loading'
import Toast from './Toast'
import { processImageData } from '../process-image'
import { HistoryContext } from './HistoryProvider'
import { useHistory } from 'react-router'

const rePin = /[\d-.]{14,}/
const MIN_DIGITS = 14

const CamScan = () => {
  const camRef = useRef(null)
  const { setCurrentPin } = useContext(HistoryContext)
  const { push } = useHistory()
  const { workerState, getWorker, getWorkerLog, getWorkerError } =
    useTesseract()
  const {
    streamState,
    getStreamError,
    startStream,
    getStream,
    getTorchSupport,
    toggleTorchMode,
  } = useCameraStream({
    autoStart: false,
  })

  const [processingMsg, setProcessingMsg] = useState(false)
  const [isProcessing, setIsProcessing] = useState(null)

  useEffect(() => {
    if (workerState === 'ready') {
      startStream()
    }
  }, [workerState, startStream])

  const onTakePhoto = async function () {
    setProcessingMsg('Capturing Image...')
    setIsProcessing(true)

    try {
      let framCanvas = await camRef.current.grabFrameCanvas()
      const context = framCanvas.getContext('2d')
      let imagedata = context.getImageData(
        0,
        0,
        framCanvas.width,
        framCanvas.height
      )

      setProcessingMsg('Processing Image...')
      imagedata = await processImageData(imagedata, 35)
      context.putImageData(imagedata, 0, 0)
      const tesseract = getWorker()

      setProcessingMsg('Detecting...')
      const {
        data: { text },
      } = await tesseract.recognize(framCanvas)

      const match = text.match(rePin)

      if (match) {
        const pin = match[0]
        const digits = pin.replace(/\D/g, '')
        if (digits.length >= MIN_DIGITS) {
          setCurrentPin(pin)
          push('/result')
        } else {
          setProcessingMsg({ text: 'No Pin Detected!', type: 'error' })
        }
      } else {
        setProcessingMsg({ text: 'No Pin Detected!', type: 'error' })
      }
    } catch (e) {
      setProcessingMsg({ text: e.message, type: 'error' })
    } finally {
      setIsProcessing(false)
    }
  }

  const hasError = workerState === 'error' || streamState === 'error'
  const error = hasError && (getWorkerError() || getStreamError())
  const log = workerState !== 'ready' ? getWorkerLog() : 'Starting Camera'
  const isReady = workerState === 'ready' && streamState === 'started'
  const torchSupported = isReady && getTorchSupport()

  return (
    <>
      {!isReady && !hasError && <Loading message={log} />}
      {hasError && <Loading message={error} hasError={true} />}
      {isReady && (
        <>
          <CameraStreamOutput
            stream={getStream()}
            isProcessing={isProcessing}
            ref={camRef}
          />
          <div className="w-full absolute bottom-0 left-0 text-center px-4 py-2 flex flex-col justify-center items-center lg:pl-12">
            {<Toast text={processingMsg || ''} sticky={isProcessing} />}
            <CameraActionButton
              isProcessing={isProcessing}
              onClick={onTakePhoto}
            />
            {torchSupported && (
              <button
                className="bg-white w-8 h-8 rounded-full text-grey-800 outline-none"
                onClick={toggleTorchMode}
              >
                <span className="icon-lightbulb"></span>
              </button>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default CamScan
