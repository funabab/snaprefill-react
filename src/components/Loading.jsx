import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
/* eslint import/no-webpack-loader-syntax: off */
import Icon from '!!svg-inline-loader!../icon.svg'
import '../css/icon-svg.css'

const elLoadingContainer = document.getElementById('loading-container')

const Loading = ({ message, hasError }) => {
  const render = (
    <div
      className={classnames(
        'w-screen h-screen bg-white flex flex-col justify-center items-center loading',
        { 'loading-screen': !hasError }
      )}
    >
      <div dangerouslySetInnerHTML={{ __html: Icon }}></div>
      <em
        className={classnames(
          'not-italic text-xs font-bold pt-3 uppercase text-grey-400 h-10',
          { 'text-red-600': hasError }
        )}
      >
        {hasError && 'Error: '} {message && message + '...'}
      </em>
      {hasError && (
        <button
          className="btn bg-red-300 text-grey-50"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      )}
    </div>
  )

  return createPortal(render, elLoadingContainer)
}

Loading.propTypes = {
  message: PropTypes.string,
  hasError: PropTypes.bool,
}

export default Loading
