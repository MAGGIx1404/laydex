import '../styles/main.scss'

import { setDynamicVH } from './utils/_viewports'

import Hamb from './components/_hamb'
import Search from './components/_search'
import Sliders from './components/_slider'
import ScrollAnimations from './components/_scrolltrigger'
import Accordion from './components/_accordion'

import Reveal from './animations/_reveal'

if (window.history.scrollRestoration) {
    window.history.scrollRestoration = 'manual'
}
window.scrollTo(0, 0)

class _APP {
    constructor() {
        console.log('App is running🦸🦸🦸🦸...')
        this.animations = []
        this.revealElements = [...document.querySelectorAll('[data-animation="reveal"]')]
        this._init()
    }

    _init() {
        try {
            this._initHamb()
            this._initSearch()
            this._initSliders()
            this._initScrollAnimations()
            this._initTabs()
            this._initPanel()
            this._initRevealAnimations()
            this._initAccordion()
            console.log('App initialized successfully🎉🎉🎉🎉')
        } catch (error) {
            console.error(error)
            console.log('App initialization failed 😢')
        }
    }

    _initHamb() {
        new Hamb()
    }

    _initSearch() {
        new Search()
    }

    _initSliders() {
        new Sliders()
    }

    _initScrollAnimations() {
        const section = document.querySelector('.why')
        if (section) {
            new ScrollAnimations(section)
        }
    }

    _initAccordion() {
        new Accordion()
    }

    _initPanel() {
        const panel = document.querySelector('.panel')
        const triggers = [...document.querySelectorAll('[data-panel-trigger]')]
        if (panel && triggers.length > 0) {
            const closeBtn = panel.querySelector('.close-btn')
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    panel.classList.remove('active')
                })
            }

            triggers.forEach((trigger) => {
                trigger.addEventListener('click', () => {
                    panel.classList.add('active')
                })
            })
        }
    }

    _initTabs() {
        const sections = document.querySelectorAll('section, .panel[data-panel]')

        sections.forEach((section) => {
            const tabs = section.querySelectorAll('[data-tab]')
            const contents = section.querySelectorAll('[data-tab-content]')
            if (tabs.length === 0 || contents.length === 0) return

            const isMultiSelect = section.hasAttribute('data-tab-multi')

            // URL-based tab activation for multi-select sections
            if (isMultiSelect) {
                const urlParams = new URLSearchParams(window.location.search)
                const tabsParam = urlParams.get('tabs')

                if (tabsParam) {
                    // Parse URL: ?tabs=building-product+roofing
                    const activeFromUrl = tabsParam.split(' ').map((t) => t.trim()).filter(Boolean)

                    // Clear default active states
                    tabs.forEach((t) => t.classList.remove('active'))
                    contents.forEach((c) => c.classList.remove('active'))

                    // Activate tabs from URL
                    activeFromUrl.forEach((slug) => {
                        const matchingTab = section.querySelector(`[data-tab="${slug}"]`)
                        if (matchingTab) matchingTab.classList.add('active')
                        section.querySelectorAll(`[data-tab-content="${slug}"]`).forEach((c) => c.classList.add('active'))
                    })

                    // Sync "all" tab if all individual tabs are active
                    const allTab = section.querySelector('[data-tab="all"]')
                    if (allTab) {
                        const nonAllTabs = [...tabs].filter((t) => t.getAttribute('data-tab') !== 'all')
                        if (nonAllTabs.every((t) => t.classList.contains('active'))) {
                            allTab.classList.add('active')
                        }
                    }
                } else {
                    // No URL param: use default active classes from markup
                    const defaultActiveTabs = section.querySelectorAll('[data-tab].active')
                    defaultActiveTabs.forEach((activeTab) => {
                        const activeValue = activeTab.getAttribute('data-tab')
                        if (activeValue === 'all') {
                            contents.forEach((c) => c.classList.add('active'))
                        } else {
                            section.querySelectorAll(`[data-tab-content="${activeValue}"]`).forEach((c) => c.classList.add('active'))
                        }
                    })
                }
            } else {
                // Initialize single-select: check which tab has active class and activate matching content
                const activeTabs = section.querySelectorAll('[data-tab].active')
                activeTabs.forEach((activeTab) => {
                    const activeValue = activeTab.getAttribute('data-tab')
                    if (activeValue === 'all') {
                        contents.forEach((c) => c.classList.add('active'))
                    } else {
                        section.querySelectorAll(`[data-tab-content="${activeValue}"]`).forEach((c) => c.classList.add('active'))
                    }
                })
            }

            if (isMultiSelect) {
                // Helper: update URL with current active tabs
                const updateUrl = () => {
                    const nonAllTabs = [...tabs].filter((t) => t.getAttribute('data-tab') !== 'all')
                    const activeSlugs = nonAllTabs.filter((t) => t.classList.contains('active')).map((t) => t.getAttribute('data-tab'))

                    const url = new URL(window.location)
                    if (activeSlugs.length === 0 || activeSlugs.length === nonAllTabs.length) {
                        url.searchParams.delete('tabs')
                    } else {
                        url.searchParams.set('tabs', activeSlugs.join('+'))
                    }
                    window.history.replaceState({}, '', url)
                }

                // Multi-select mode: toggle tabs independently
                tabs.forEach((tab) => {
                    const target = tab.getAttribute('data-tab')

                    tab.addEventListener('click', () => {
                        if (target === 'all') {
                            // "All" tab toggles everything
                            const isActive = tab.classList.contains('active')
                            if (isActive) {
                                tab.classList.remove('active')
                                contents.forEach((c) => c.classList.remove('active'))
                            } else {
                                tabs.forEach((t) => t.classList.add('active'))
                                contents.forEach((c) => c.classList.add('active'))
                            }
                        } else {
                            // Toggle individual tab
                            tab.classList.toggle('active')

                            // Toggle matching content
                            section.querySelectorAll(`[data-tab-content="${target}"]`).forEach((c) => c.classList.toggle('active'))

                            // Sync the "all" tab state
                            const allTab = section.querySelector('[data-tab="all"]')
                            if (allTab) {
                                const nonAllTabs = [...tabs].filter((t) => t.getAttribute('data-tab') !== 'all')
                                const allActive = nonAllTabs.every((t) => t.classList.contains('active'))
                                const noneActive = nonAllTabs.every((t) => !t.classList.contains('active'))

                                if (allActive) {
                                    allTab.classList.add('active')
                                } else {
                                    allTab.classList.remove('active')
                                }

                                // If nothing is selected, show all
                                if (noneActive) {
                                    tabs.forEach((t) => t.classList.add('active'))
                                    contents.forEach((c) => c.classList.add('active'))
                                }
                            }
                        }

                        updateUrl()
                    })
                })
            } else {
                // Single-select mode (default behavior)
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
            }

            // Sub-tabs
            const subTabs = section.querySelectorAll('[data-sub-tab]')
            const subContents = section.querySelectorAll('[data-sub-tab-content]')
            if (subTabs.length === 0 || subContents.length === 0) return

            // Initialize: check which sub-tab has active class and activate matching sub-content
            const activeSubTab = section.querySelector('[data-sub-tab].active')
            if (activeSubTab) {
                const activeSubValue = activeSubTab.getAttribute('data-sub-tab')
                if (activeSubValue === 'all') {
                    subContents.forEach((c) => c.classList.add('active'))
                } else {
                    section.querySelectorAll(`[data-sub-tab-content="${activeSubValue}"]`).forEach((c) => c.classList.add('active'))
                }
            }

            subTabs.forEach((subTab) => {
                const target = subTab.getAttribute('data-sub-tab')

                subTab.addEventListener('click', () => {
                    subTabs.forEach((t) => t.classList.remove('active'))
                    subContents.forEach((c) => c.classList.remove('active'))

                    subTab.classList.add('active')
                    if (target === 'all') {
                        subContents.forEach((c) => c.classList.add('active'))
                    } else {
                        section.querySelectorAll(`[data-sub-tab-content="${target}"]`).forEach((c) => c.classList.add('active'))
                    }
                })
            })
        })
    }

    _initRevealAnimations() {
        for (let i = 0; i < this.revealElements.length; i++) {
            let animation = new Reveal({ element: this.revealElements[i] })
            this.animations.push(animation)
        }
    }

    _onResize() {}
}

setDynamicVH()
let _APPLICATION = new _APP()
window.addEventListener('resize', () => {
    _APPLICATION._onResize()
    setDynamicVH()
})
