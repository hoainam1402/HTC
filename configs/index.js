import { version } from './../package.json'
import icons from './icons'
import theme from './theme'
import toolbar from './toolbar'
import navigation from './navigation'

export default {
  // product display information
  product: {
    name: 'E-BUILDING',
    version
  },

  // icon libraries
  icons,

  // theme configs
  theme,

  // toolbar configs
  toolbar,

  // navigation configs
  navigation,

  // pagination configs
  pagination: {
    itemsPerPage: 10
  }
}
