import { preloadImages } from './utils'
import '../css/style.css'

import Plane from './gl/plane'
import Smooth from './components/smooth'

preloadImages().then(() => {
  document.body.classList.remove('loading')

  const elements = document.querySelectorAll('.js-plane')
  elements.forEach((el, index) => new Plane().init(el, index))

  const smooth = new Smooth()
})
