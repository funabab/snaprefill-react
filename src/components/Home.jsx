import { useRef } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import Header from './Header'
import History from './History'
import Nav from './Nav'
import HistoryProvider from './HistoryProvider'
import About from './About'
import Result from './Result'
import CamScan from './CamScan'

const Layout = () => {
  const containerRef = useRef(null)
  return (
    <div
      ref={containerRef}
      className="flex flex-col w-full h-full bg-grey-700 transition duration-300"
    >
      <Header />
      <div className="container flex-1 flex relative mx-auto  pt-20 lg:pt-0 lg:pl-32">
        <Nav containerRef={containerRef} />

        <Switch>
          <Route path="/" exact>
            <CamScan />
          </Route>
          <Route path="/history">
            <History />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/result">
            <Result />
          </Route>
        </Switch>
      </div>
    </div>
  )
}

const Home = () => {
  return (
    <HistoryProvider>
      <HashRouter>
        <Layout />
      </HashRouter>
    </HistoryProvider>
  )
}

export default Home
