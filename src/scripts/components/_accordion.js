export default class Accordions {
    constructor() {
        this.accordions = [...document.querySelectorAll('.accordion')]
        this.accordionTriggers = [...document.querySelectorAll('.accordion-trigger')]

        this._init()
    }

    _init() {
        if (this.accordions.length.length === 0) return
        for (let i = 0; i < this.accordions.length; i++) {
            const icon = this.accordions[i].querySelector('.accordion-icon')
            this.accordionTriggers[i].addEventListener('click', () => {
                this.accordions.forEach((accordion) => {
                    if (accordion !== this.accordions[i]) {
                        accordion.classList.remove('active')
                        accordion.querySelector('.accordion-content').style.maxHeight = 0
                        const _icon = accordion.querySelector('.accordion-icon')
                        if (_icon) _icon.textContent = '+'
                    }
                })
                this.accordions[i].classList.toggle('active')
                const content = this.accordions[i].querySelector('.accordion-content')
                if (this.accordions[i].classList.contains('active')) {
                    content.style.maxHeight = content.scrollHeight + 'px'
                    if (icon) icon.textContent = '-'
                } else {
                    content.style.maxHeight = 0
                    if (icon) icon.textContent = '+'
                }
            })
        }
    }
}
