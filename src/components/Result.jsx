import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { operators, getOperatorByName } from '../operators'
import classNames from 'classnames'
import { HistoryContext } from './HistoryProvider'

const getUSSD = (code, pin) => code.replace(/s/g, '').replace('<pin>', pin)

const Result = () => {
  const history = useHistory()
  const { currentPin: pin, clearCurrentPin } = useContext(HistoryContext)
  const [operator, setOperator] = useState(null)

  if (!pin) {
    history.replace('/')
    return null
  }

  const digits = pin.replace(/\D/g, '')

  return (
    <div className="content-container lg:px-4">
      <div className="border-dotted border-t-2 border-b-2 border-grey-300 py-10 text-center text-2xl font-bold bg-grey-100 text-grey-600">
        <em className="block not-italic mb-2 font-mono">{pin}</em>

        <CopyToClipboard text={digits}>
          <button className="w-7 h-7 text-xs bg-grey-200 text-grey-400 rounded-full outline-none">
            <span className="icon-clipboard"></span>
          </button>
        </CopyToClipboard>
      </div>

      <div className="mt-8 px-8">
        <h2 className="uppercase">Operators</h2>
        <hr className="w-14 mt-1 border-primary-textDark border-2 rounded-2xl" />

        <ul className="flex mx-auto justify-center gap-2 mt-6">
          <li>
            <button
              className={classNames(
                'w-10 h-10 rounded-full border-2 border-white bg-grey-200 outline-none',
                { 'border-primary-textDark': !operator }
              )}
              onClick={() => setOperator(null)}
            ></button>
          </li>
          {operators.map(({ icon, name }, index) => (
            <li key={index}>
              <button
                className={classNames(
                  'w-10 h-10 border-2 border-white rounded-full outline-none',
                  {
                    'border-primary-textDark': name === operator,
                  }
                )}
                style={{
                  background: `url(${icon})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
                onClick={() => setOperator(name)}
              ></button>
            </li>
          ))}
        </ul>

        <div
          className="mt-8 text-center text-grey-700 font-bold text-sm py-6 border-dotted border-t border-b flex justify-center"
          style={{ minHeight: '5rem' }}
        >
          {operator && (
            <>
              <span className="text-grey-400">
                {getUSSD(getOperatorByName(operator).code, digits)}
              </span>
              <a
                href={`tel:${window.encodeURIComponent(
                  getUSSD(getOperatorByName(operator).code, digits)
                )}`}
                className="w-6 h-6 flex flex-col rounded-full text-sm text-white bg-primary-textDark ml-2"
              >
                <span className="icon-phone m-auto"></span>
              </a>
            </>
          )}
        </div>

        <div className="text-center mt-4 mb-2">
          <button
            className="w-16 h-16 text-4xl rounded-full bg-primary-textDarker text-white shadow-lg"
            onClick={() => clearCurrentPin()}
          >
            <span className="icon-cw"></span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Result
