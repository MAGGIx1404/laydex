export default class Accordions {
    constructor() {
        this.accordions = [...document.querySelectorAll('.accordion')]

        this._init()
    }

    _init() {
        if (this.accordions.length === 0) return

        this.accordions.forEach((accordion) => {
            const trigger = accordion.querySelector(':scope > .accordion-trigger')
            if (!trigger) return

            trigger.addEventListener('click', () => {
                const icon = trigger.querySelector('.accordion-icon')
                const content = accordion.querySelector(':scope > .accordion-content')
                if (!content) return

                // Close siblings at the same level
                const parent = accordion.parentElement
                if (parent) {
                    const siblings = [...parent.querySelectorAll(':scope > .accordion')]
                    siblings.forEach((sibling) => {
                        if (sibling !== accordion && sibling.classList.contains('opened')) {
                            sibling.classList.remove('opened')
                            const sibContent = sibling.querySelector(':scope > .accordion-content')
                            if (sibContent) sibContent.style.maxHeight = 0
                            const sibIcon = sibling.querySelector(':scope > .accordion-trigger .accordion-icon')
                            if (sibIcon) sibIcon.textContent = '+'

                            // Close nested opened accordions inside sibling
                            const nested = [...sibling.querySelectorAll('.accordion.opened')]
                            nested.forEach((child) => {
                                child.classList.remove('opened')
                                const childContent = child.querySelector(':scope > .accordion-content')
                                if (childContent) childContent.style.maxHeight = 0
                                const childIcon = child.querySelector(':scope > .accordion-trigger .accordion-icon')
                                if (childIcon) childIcon.textContent = '+'
                            })
                        }
                    })
                }

                // Toggle clicked accordion
                accordion.classList.toggle('opened')
                if (accordion.classList.contains('opened')) {
                    content.style.maxHeight = content.scrollHeight + 'px'
                    if (icon) icon.textContent = '-'

                    // Expand ancestors so they don't clip
                    this._expandAncestors(accordion)
                } else {
                    content.style.maxHeight = 0
                    if (icon) icon.textContent = '+'

                    // Close nested opened accordions
                    const nested = [...accordion.querySelectorAll('.accordion.opened')]
                    nested.forEach((child) => {
                        child.classList.remove('opened')
                        const childContent = child.querySelector(':scope > .accordion-content')
                        if (childContent) childContent.style.maxHeight = 0
                        const childIcon = child.querySelector(':scope > .accordion-trigger .accordion-icon')
                        if (childIcon) childIcon.textContent = '+'
                    })
                }
            })
        })
    }

    _expandAncestors(accordion) {
        let el = accordion.parentElement
        while (el) {
            const parentAccordion = el.closest('.accordion')
            if (!parentAccordion) break

            const parentContent = parentAccordion.querySelector(':scope > .accordion-content')
            if (parentContent && parentAccordion.classList.contains('opened')) {
                parentContent.style.maxHeight = 'none'
            }
            el = parentAccordion.parentElement
        }
    }
}
