export default class Hamb {
    constructor() {
        this.menu = document.querySelector('.hamb-menu')
        this.trigger = document.querySelector('.hamb-btn')

        if (!this.menu || !this.trigger) return

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

        if (!isOpen) this._resetAccordions()
    }

    _initAccordions() {
        const accordions = [...this.menu.querySelectorAll('.hamb-accordion')]

        accordions.forEach((accordion) => {
            const trigger = accordion.querySelector(':scope > .hamb-accordion-trigger')
            if (!trigger) return

            trigger.addEventListener('click', (e) => {
                e.stopPropagation()

                const content = accordion.querySelector(':scope > .hamb-accordion-content')
                if (!content) return

                const isActive = accordion.classList.contains('active')

                // Close siblings at same level
                const parent = accordion.parentElement
                if (parent) {
                    const siblings = [...parent.querySelectorAll(':scope > .hamb-accordion.active')]
                    siblings.forEach((sibling) => {
                        if (sibling !== accordion) {
                            this._closeAccordion(sibling)
                        }
                    })
                }

                // Toggle clicked accordion
                if (isActive) {
                    this._closeAccordion(accordion)
                } else {
                    this._openAccordion(accordion)
                }
            })
        })
    }

    _openAccordion(accordion) {
        const content = accordion.querySelector(':scope > .hamb-accordion-content')
        if (!content) return

        accordion.classList.add('active')
        content.style.maxHeight = content.scrollHeight + 'px'

        // Ancestors need to grow — set them to none so they don't clip children
        this._expandAncestors(accordion)
    }

    _closeAccordion(accordion) {
        const content = accordion.querySelector(':scope > .hamb-accordion-content')
        if (!content) return

        // Close all nested active accordions inside first
        const nested = [...accordion.querySelectorAll('.hamb-accordion.active')]
        nested.forEach((child) => {
            child.classList.remove('active')
            const childContent = child.querySelector(':scope > .hamb-accordion-content')
            if (childContent) childContent.style.maxHeight = 0
        })

        accordion.classList.remove('active')
        content.style.maxHeight = 0

        // Recalculate ancestors — set back to scrollHeight so they can animate closed later
        this._recalcAncestors(accordion)
    }

    _expandAncestors(accordion) {
        let el = accordion.parentElement
        while (el) {
            const parentAccordion = el.closest('.hamb-accordion')
            if (!parentAccordion || !this.menu.contains(parentAccordion)) break

            const parentContent = parentAccordion.querySelector(':scope > .hamb-accordion-content')
            if (parentContent && parentAccordion.classList.contains('active')) {
                parentContent.style.maxHeight = 'none'
            }
            el = parentAccordion.parentElement
        }
    }

    _recalcAncestors(accordion) {
        let el = accordion.parentElement
        while (el) {
            const parentAccordion = el.closest('.hamb-accordion')
            if (!parentAccordion || !this.menu.contains(parentAccordion)) break

            const parentContent = parentAccordion.querySelector(':scope > .hamb-accordion-content')
            if (parentContent && parentAccordion.classList.contains('active')) {
                // Remove none, read actual height, set it as px for future transitions
                parentContent.style.maxHeight = 'none'
                const h = parentContent.scrollHeight
                parentContent.style.maxHeight = h + 'px'
            }
            el = parentAccordion.parentElement
        }
    }

    _resetAccordions() {
        const allActive = [...this.menu.querySelectorAll('.hamb-accordion.active')]
        allActive.forEach((accordion) => {
            accordion.classList.remove('active')
            const content = accordion.querySelector(':scope > .hamb-accordion-content')
            if (content) content.style.maxHeight = 0
        })
    }
}
