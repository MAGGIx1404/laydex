export default class Hamb {
    constructor() {
        this.menu = document.querySelector('.hamb-menu')
        this.trigger = document.querySelector('.hamb-btn')

        if (!this.menu || !this.trigger) return

        this._init()
    }

    _init() {
        this.trigger.addEventListener('click', this._toggle.bind(this))
    }

    _toggle() {
        window.scrollTo(0, 0)
        this.menu.classList.toggle('active')
        this.trigger.classList.toggle('active')
        document.body.classList.toggle('menu-open')
        document.body.style.overflow = this.menu.classList.contains('active') ? 'hidden' : 'auto'
    }
}
