/* eslint no-undef: off */
const VERSION = APP_VERSION

const Header = () => {
  return (
    <header>
      <div className="uppercase bg-primary py-2">
        <div className="container mx-auto px-2 flex items-center md:justify-between">
          <header className="text-grey-50 text-xl font-bold">
            Snap<span className="text-grey-700 ml-1">Refill</span>
          </header>
          <div>
            <span className="text-xs text-grey-500 ml-1 normal-case font-bold md:font-normal">
              v{VERSION}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
