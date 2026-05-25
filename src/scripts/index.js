import '../styles/main.scss'

import { setDynamicVH } from './utils/_viewports'

import Hamb from './components/_hamb'
import Sliders from './components/_slider'

if (window.history.scrollRestoration) {
    window.history.scrollRestoration = 'manual'
}
window.scrollTo(0, 0)

class _APP {
    constructor() {
        console.log('App is running🦸🦸🦸🦸...')
        this._init()
    }

    _init() {
        try {
            this._initHamb()
            this._initSliders()
            console.log('App initialized successfully🎉🎉🎉🎉')
        } catch (error) {
            console.error(error)
            console.log('App initialization failed 😢')
        }
    }

    _initHamb() {
        new Hamb()
    }

    _initSliders() {
        new Sliders()
    }

    _onResize() {}
}

setDynamicVH()
let _APPLICATION = new _APP()
window.addEventListener('resize', () => {
    _APPLICATION._onResize()
    setDynamicVH()
})
