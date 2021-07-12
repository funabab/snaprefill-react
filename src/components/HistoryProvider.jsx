import { createContext, useState } from 'react'
import { v4 as uuid4 } from 'uuid'

const HistoryContext = createContext(null)

const STORAGE_KEY = 'history'

const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState(
    () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  )
  const [currentPin, setCurrentPin] = useState(null)

  const values = {
    history,
    currentPin,
    setCurrentPin(value) {
      setHistory((history) => {
        const find = history.find((item) => item.value === value)
        let store
        if (!find) {
          store = [{ value, id: uuid4(), timestamp: Date.now() }, ...history]
          localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
        } else {
          store = history
        }
        setCurrentPin(value)
        return store
      })
    },
    clearCurrentPin() {
      setCurrentPin(null)
    },
    remove(id) {
      setHistory((history) => {
        const store = history.filter((item) => item.id !== id)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
        return store
      })
    },
  }

  return (
    <HistoryContext.Provider value={values}>{children}</HistoryContext.Provider>
  )
}

export default HistoryProvider
export { HistoryContext }
