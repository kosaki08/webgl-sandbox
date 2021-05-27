import { preloadImages } from './utils'
import '../css/style.css'

preloadImages().then(() => {
  document.body.classList.remove('loading')
})
