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
            this._initTabs()
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

    _initTabs() {
        const sections = document.querySelectorAll('section')

        sections.forEach((section) => {
            const tabs = section.querySelectorAll('[data-tab]')
            const contents = section.querySelectorAll('[data-tab-content]')
            if (tabs.length === 0 || contents.length === 0) return

            // Initialize: check which tab has active class and activate matching content
            const activeTab = section.querySelector('[data-tab].active')
            if (activeTab) {
                const activeValue = activeTab.getAttribute('data-tab')
                if (activeValue === 'all') {
                    contents.forEach((c) => c.classList.add('active'))
                } else {
                    section.querySelectorAll(`[data-tab-content="${activeValue}"]`).forEach((c) => c.classList.add('active'))
                }
            }

            tabs.forEach((tab) => {
                const target = tab.getAttribute('data-tab')

                tab.addEventListener('click', () => {
                    tabs.forEach((t) => t.classList.remove('active'))
                    contents.forEach((c) => c.classList.remove('active'))

                    tab.classList.add('active')
                    if (target === 'all') {
                        contents.forEach((c) => c.classList.add('active'))
                    } else {
                        section.querySelectorAll(`[data-tab-content="${target}"]`).forEach((c) => c.classList.add('active'))
                    }
                })
            })
        })
    }

    _onResize() {}
}

setDynamicVH()
let _APPLICATION = new _APP()
window.addEventListener('resize', () => {
    _APPLICATION._onResize()
    setDynamicVH()
})
