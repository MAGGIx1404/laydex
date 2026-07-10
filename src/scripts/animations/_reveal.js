import Animation from '../classes/_animation'

export default class extends Animation {
    constructor({ element }) {
        super({
            element,
        })

        this.onResize()

        if ('IntersectionObserver' in window) {
            this.animateOut()
        }
    }

    animateIn() {
        super.animateIn()

        this.element.classList.add('reveal')
    }

    animateOut() {
        super.animateOut()

        this.element.classList.remove('reveal')
    }

    onResize() {}
}
