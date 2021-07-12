import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import '../css/camera-action-button.css'

const CameraActionButton = ({ onClick, isProcessing }) => {
  return (
    <div
      className={classNames('w-16 h-16 relative mb-2 lg:w-20 lg:h-20', {
        'camera-action-button-processing': isProcessing,
      })}
    >
      <button
        className={classNames(
          'text-2xl w-full h-full text-white bg-primary-textDark rounded-full outline-none transition transform duration-300 hover:opacity-80 lg:text-4xl',
          { 'opacity-0 scale-0': isProcessing }
        )}
        onClick={onClick}
      >
        <span className="icon-aperture"></span>
      </button>
    </div>
  )
}

CameraActionButton.propTypes = {
  onClick: PropTypes.func,
  isProcessing: PropTypes.bool,
}

CameraActionButton.defaultProps = {
  isProcessing: false,
}

export default CameraActionButton
