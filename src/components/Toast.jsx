import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

const TOAST_TIMEOUT = 3000

const Toast = (props) => {
  const type = typeof props.text === 'object' ? props.text.type : 'info'
  const text =
    typeof props.text === 'object' && props.text !== null
      ? props.text.text
      : props.text

  const { sticky } = props

  const [active, setActive] = useState(!!text)

  useEffect(() => {
    if (sticky) {
      setActive(true)
    } else {
      if (active) {
        const id = setTimeout(() => {
          setActive(false)
        }, TOAST_TIMEOUT)
        return () => {
          clearTimeout(id)
        }
      }
    }
  }, [active, sticky])

  useEffect(() => {
    setActive(true)
    if (!sticky) {
      const id = setTimeout(() => {
        setActive(false)
      }, TOAST_TIMEOUT)

      return () => {
        clearTimeout(id)
      }
    }
  }, [text, sticky])

  if (!text) {
    return null
  }

  return (
    <div
      className={classNames(
        'bg-opacity-60 px-6 py-2 uppercase text-xs text-grey-300 mb-3 rounded-full max-w-sm truncate opacity-0 transition duration-500',
        { 'bg-primary-textDarker': type === 'info' },
        { 'opacity-100': active },
        { 'bg-red-500 text-grey-300 font-semibold': type === 'error' }
      )}
    >
      {text}
    </div>
  )
}

Toast.propTypes = {
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.exact({
      text: PropTypes.string,
      type: PropTypes.string,
    }),
  ]),
  sticky: PropTypes.bool,
}

export default Toast
