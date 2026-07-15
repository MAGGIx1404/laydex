export default class Search {
    constructor() {
        this.wrapper = document.querySelector('.search-wrapper')
        this.trigger = document.querySelector('.search-trigger')
        this.box = document.querySelector('.search-wrapper .search-box')

        if (!this.wrapper || !this.trigger || !this.box) return

        this._init()
    }

    _init() {
        this.trigger.addEventListener('click', this._toggle.bind(this))
        document.addEventListener('click', this._outsideClick.bind(this))
    }

    _toggle(e) {
        e.stopPropagation()
        this.trigger.classList.toggle('active')
        this.box.classList.toggle('active')
    }

    _outsideClick(e) {
        if (!this.wrapper.contains(e.target)) {
            this.trigger.classList.remove('active')
            this.box.classList.remove('active')
        }
    }
}
