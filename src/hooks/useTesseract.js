/* eslint import/no-webpack-loader-syntax: off */
import TesseractWorkerScript from '!!file-loader!tesseract.js/dist/worker.min.js'
import TesseractCore from '!!file-loader!tesseract.js-core/tesseract-core.wasm.js'

import { createWorker } from 'tesseract.js'
import { useCallback, useEffect, useRef, useState } from 'react'

let workerLogger

const createTesseractWorker = async () => {
  const worker = createWorker({
    logger: (log) => {
      if (workerLogger) {
        workerLogger(log.status)
      }
    },
    workerPath: TesseractWorkerScript,
    corePath: TesseractCore,
    langPath: '/tesseract/lang_data/',
  })

  await worker.load()
  await worker.loadLanguage('eng')
  await worker.initialize('eng')
  await worker.setParameters({
    tessedit_char_whitelist: '1234567890.-',
  })
  return worker
}
let workerPromise
const getWorkerPromise = () => {
  if (!workerPromise) {
    workerPromise = createTesseractWorker()
  }
  return workerPromise
}

const useTesseract = () => {
  const [state, setState] = useState('pending')
  const [log, setLog] = useState('')

  const workerRef = useRef(null)

  useEffect(() => {
    workerLogger = setLog
    getWorkerPromise()
      .then((worker) => {
        workerRef.current = worker
        setState('ready')
      })
      .catch((err) => {
        setLog(err.message)
        setState('error')
      })
      .finally(() => {
        workerLogger = null
      })
  }, [])

  const getWorkerLog = useCallback(() => {
    return log
  }, [log])

  const getWorkerError = useCallback(() => {
    if (state !== 'error') {
      return null
    }
    return log
  }, [state, log])

  return {
    getWorkerLog,
    getWorkerError,
    workerState: state,
    getWorker() {
      if (state !== 'ready') {
        throw new Error(`Can't get worker, workerState is ${state}`)
      }
      return workerRef.current
    },
  }
}

export default useTesseract
