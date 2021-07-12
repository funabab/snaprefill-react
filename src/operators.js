import IconGlo from './assets/images/glo-icon.png'
import IconMtn from './assets/images/mtn-icon.png'
import IconAirtel from './assets/images/airtel-icon.png'
import Icon9Mobile from './assets/images/9mobile-icon.png'

const operators = [
  {
    name: 'Glo',
    code: '*123*<pin>#',
    icon: IconGlo,
  },
  {
    name: 'Mtn',
    code: '*555*<pin>#',
    icon: IconMtn,
  },
  {
    name: 'Airtel',
    code: '*126*<pin>#',
    icon: IconAirtel,
  },
  {
    name: '9Mobile',
    code: '*222*<pin>#',
    icon: Icon9Mobile,
  },
]

const getOperatorByName = (name) => operators.find((item) => item.name === name)

export { operators, getOperatorByName }
