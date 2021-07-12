import Icon from '../icon.svg'

/* eslint no-undef: off */
const GITHUB = APP_GITHUB
const VERSION = APP_VERSION

const About = () => {
  return (
    <div className="content-container flex flex-col items-center justify-center text-grey-700">
      <img src={Icon} alt="SnapRefill icon" className="w-24 h-24 mb-2" />
      <span className="text-xl font-bold">SnapRefill</span>
      <span className="text-sm">v{VERSION}</span>
      <a
        href={GITHUB}
        target="_blank"
        rel="noreferrer"
        className="btn bg-grey-800 text-white mt-2"
      >
        View on Github
      </a>
    </div>
  )
}

export default About
