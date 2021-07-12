import React, { useContext } from 'react'
import { HistoryContext } from './HistoryProvider'

const History = () => {
  const { history, remove } = useContext(HistoryContext)

  return (
    <div className="content-container flex flex-col">
      {history.length > 0 && (
        <ul>
          {history.map(({ value, timestamp, id }) => (
            <li
              key={id}
              className="block px-2 py-6 border-b border-grey-300 mx-6 last:border-0"
            >
              <div className="flex justify-between">
                <span className="text-grey-600 text-xl font-bold">{value}</span>
                <button
                  className="w-6 h-6 rounded-full bg-red-300 text-white"
                  onClick={() => remove(id)}
                >
                  &times;
                </button>
              </div>
              <span className="block text-xs mt-2 text-grey-600">
                {new Date(timestamp).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
      {history.length === 0 && (
        <span className="m-auto uppercase text-grey-700 text-sm">
          History is empty
        </span>
      )}
    </div>
  )
}

export default History
