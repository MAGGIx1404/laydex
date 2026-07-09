export default class Hamb {
    constructor() {
        this.menu = document.querySelector('.hamb-menu')
        this.trigger = document.querySelector('.hamb-btn')

        if (!this.menu || !this.trigger) return

        this.accordionTriggers = [...this.menu.querySelectorAll('.hamb-accordion-trigger')]

        this._init()
    }

    _init() {
        this.trigger.addEventListener('click', this._toggle.bind(this))
        this._initAccordions()
    }

    _toggle() {
        window.scrollTo(0, 0)
        this.menu.classList.toggle('active')
        this.trigger.classList.toggle('active')
        document.body.classList.toggle('menu-open')

        const isOpen = this.menu.classList.contains('active')
        document.body.style.overflow = isOpen ? 'hidden' : 'auto'

        // Collapse every open accordion whenever the menu is closed
        if (!isOpen) this._resetAccordions()
    }

    _initAccordions() {
        this.accordionTriggers.forEach((trigger) => {
            trigger.addEventListener('click', (event) => {
                // Prevent the click from bubbling to an ancestor accordion trigger
                event.stopPropagation()

                const accordion = trigger.closest('.hamb-accordion')
                if (!accordion) return

                const isActive = accordion.classList.contains('active')

                // Single-open behaviour: close siblings at the same depth
                const parent = accordion.parentElement
                if (parent) {
                    parent
                        .querySelectorAll(':scope > .hamb-accordion.active')
                        .forEach((sibling) => sibling.classList.remove('active'))
                }

                // Toggle the clicked accordion. The grid-template-rows trick in
                // CSS lets nested accordions expand their parents automatically.
                accordion.classList.toggle('active', !isActive)
            })
        })
    }

    _resetAccordions() {
        this.menu.querySelectorAll('.hamb-accordion.active').forEach((accordion) => {
            accordion.classList.remove('active')
        })
    }
}
