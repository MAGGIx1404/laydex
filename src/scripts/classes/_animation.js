import AutoBind from 'auto-bind'
import Prefix from 'prefix'

export default class Animation {
    constructor({ element, elements }) {
        AutoBind(this)

        const { animationTarget } = element.dataset

        this.delay = element.dataset.animationDelay ? element.dataset.animationDelay : 0
        this.element = element
        this.elements = elements

        this.target = animationTarget ? element.closest(animationTarget) : element
        this.transformPrefix = Prefix('transform')

        this.isRepeated = element.getAttribute('data-animation-repeat') === 'true'

        this.isVisible = false

        if ('IntersectionObserver' in window) {
            this.createObserver()

            this.animateOut()
        } else {
            this.animateIn()
        }
    }

    createObserver() {
        this.observer = new window.IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!this.isVisible && entry.isIntersecting) {
                        setTimeout(() => {
                            this.animateIn()
                        }, this.delay)
                        observer.unobserve(entry.target)
                    }
                })
            },
            {
                threshold: 0.5,
            }
        ).observe(this.target)
    }

    animateIn() {
        this.isVisible = true
    }

    animateOut() {
        this.isVisible = false
    }
}
