import classNames from 'classnames'
import {
  useCallback,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react'
import PropTypes from 'prop-types'

import '../css/overlay.css'

const CameraStreamOverlay = forwardRef(({ isProcessing }, ref) => {
  const canvasRef = useRef(null)
  const contentRef = useRef(null)
  const sizeRef = useRef({})

  useImperativeHandle(ref, () => ({
    getBoundRect() {
      return sizeRef.current
    },
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    const content = contentRef.current

    const render = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      const context = canvas.getContext('2d')

      const canvasBound = canvas.getBoundingClientRect()
      const contentBound = content.getBoundingClientRect()

      const x = contentBound.x - canvasBound.x
      const y = contentBound.y - canvasBound.y
      const w = contentBound.width
      const h = contentBound.height
      sizeRef.current = { x, y, width: w, height: h }

      context.fillStyle = 'black'
      context.fillRect(0, 0, canvas.width, canvas.height)
      const compositeOperation = context.globalCompositeOperation
      context.globalCompositeOperation = 'destination-out'
      context.fillRect(x, y, w, h)
      context.globalCompositeOperation = compositeOperation
    }

    render()
    window.addEventListener('resize', render)
    return () => window.removeEventListener('resize', render)
  }, [canvasRef])

  const contentRefCallback = useCallback((node) => {
    if (!node) {
      return
    }
    contentRef.current = node
    const width = node.clientWidth
    // aspect ratio: 0.158536585
    // no scientific for choicing this figure
    // just looks good
    node.style = `height: ${width * 0.158536585}px`
  }, [])
  return (
    <div className="w-full h-full absolute left-0 top-0 flex flex-col justify-center items-center px-4 lg:pl-36">
      <canvas
        className="w-full h-full absolute left-0 top-0 opacity-60"
        ref={canvasRef}
      ></canvas>
      <div
        className={classNames('w-full -mt-24 relative overlay', {
          processing: isProcessing,
        })}
        ref={contentRefCallback}
      >
        <svg>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            strokeDasharray="10, 10"
          />
        </svg>
        <div className="uppercase text-xs text-grey-300 absolute -bottom-8 text-center w-full left-0">
          Align pin in Region
        </div>
      </div>
    </div>
  )
})

CameraStreamOverlay.propTypes = {
  isProcessing: PropTypes.bool,
}

export default CameraStreamOverlay
