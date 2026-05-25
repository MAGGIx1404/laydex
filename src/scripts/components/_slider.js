import EmblaCarousel from 'embla-carousel'
import Fade from 'embla-carousel-fade'
import AutoScroll from 'embla-carousel-auto-scroll'
import ClassNames from 'embla-carousel-class-names'
import Autoplay from 'embla-carousel-autoplay'

export default class Sliders {
    constructor() {
        this.sections = document.querySelectorAll('section')
        if (!this.sections.length) return

        this.init()
    }

    init() {
        this.sections.forEach((section) => {
            const isConnected = section.hasAttribute('data-inter-connected-slider')
            const sliders = this.createSliders(section)
            if (!sliders.length) return

            this.bindControls(section, sliders, isConnected)
        })
    }

    createSliders(section) {
        return [...section.querySelectorAll('.embla')]
            .map((el) => {
                if (el.classList.contains('fade-slider')) return new FadeSlider(el)
                if (el.classList.contains('autoscroll-slider')) return new AutoScrollSlider(el)
                if (el.classList.contains('carousel-slider')) return new CarouselSlider(el)
                if (el.classList.contains('autoplay-slider')) return new AutoPlaySlider(el)
                return null
            })
            .filter(Boolean)
    }

    bindControls(section, sliders) {
        const prevBtns = section.querySelectorAll('.slider-prev')
        const nextBtns = section.querySelectorAll('.slider-next')

        const scroll = (direction) => {
            sliders.forEach((slider) => slider.embla?.[direction]())
        }

        prevBtns.forEach((btn) => btn.addEventListener('click', () => scroll('scrollPrev')))

        nextBtns.forEach((btn) => btn.addEventListener('click', () => scroll('scrollNext')))
    }
}

const addDotButtonAndClickHandlers = (emblaApi, dotsNode) => {
    let dotNodes = []

    const addDotBtnsWithClickHandlers = () => {
        dotsNode.innerHTML = emblaApi
            .scrollSnapList()
            .map(() => '<button class="embla__dot" type="button"></button>')
            .join('')

        const scrollTo = (index) => {
            emblaApi.scrollTo(index)
        }

        dotNodes = Array.from(dotsNode.querySelectorAll('.embla__dot'))
        dotNodes.forEach((dotNode, index) => {
            dotNode.addEventListener('click', () => scrollTo(index), false)
        })
    }

    const toggleDotButtonsActive = () => {
        const previous = emblaApi.previousScrollSnap()
        const selected = emblaApi.selectedScrollSnap()
        dotNodes[previous].classList.remove('embla__dot--selected')
        dotNodes[selected].classList.add('embla__dot--selected')
    }

    addDotBtnsWithClickHandlers()
    toggleDotButtonsActive()

    emblaApi.on('reinit', addDotBtnsWithClickHandlers).on('reinit', toggleDotButtonsActive).on('select', toggleDotButtonsActive)
}

/* ---------------- Sliders ---------------- */

class FadeSlider {
    constructor(element) {
        this.embla = EmblaCarousel(element, { loop: true, align: 'start' }, [Fade(), ClassNames()])

        this.dotsNode = element.querySelector('.embla__dots')
        if (this.dotsNode) addDotButtonAndClickHandlers(this.embla, this.dotsNode)

        this.container = element.querySelector('.embla__container')

        this.embla.on('select', () => {
            const selectedIndex = this.embla.selectedScrollSnap()
            const selectedSlide = this.container.children[selectedIndex]
            if (selectedSlide) {
                this.container.style.height = `${selectedSlide.offsetHeight}px`
            }
        })

        this.embla.on('init', () => {
            setInterval(() => {
                const selectedIndex = this.embla.selectedScrollSnap()
                const selectedSlide = this.container.children[selectedIndex]
                if (selectedSlide) {
                    this.container.style.height = `${selectedSlide.offsetHeight}px`
                }
            }, 1000)
        })

        this.embla.scrollNext()
        this.embla.scrollPrev()
    }
}

class AutoScrollSlider {
    constructor(element) {
        this.isReverse = element.classList.contains('rev')
        this.embla = EmblaCarousel(element, { loop: true }, [
            AutoScroll({ startDelay: 100, stopOnInteraction: false, stopOnMouseEnter: true, speed: 2 * (this.isReverse ? -1 : 1) }),
            ClassNames(),
        ])
    }
}

class AutoPlaySlider {
    constructor(element) {
        this.embla = EmblaCarousel(
            element,
            {
                loop: true,
            },
            [ClassNames(), Fade(), Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: false })]
        )
    }
}

class CarouselSlider {
    constructor(element) {
        this.isCentered = element.classList.contains('centered')

        this.embla = EmblaCarousel(
            element,
            {
                loop: true,
                align: this.isCentered ? 'center' : 'start',
            },
            [ClassNames()]
        )
    }
}
