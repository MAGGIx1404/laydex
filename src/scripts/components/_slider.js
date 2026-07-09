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
                if (el.classList.contains('gallery-slider')) return new GallerySlider(el, section)
                return null
            })
            .filter(Boolean)
    }

    bindControls(section, sliders) {
        const prevBtns = section.querySelectorAll('.slider-prev')
        const nextBtns = section.querySelectorAll('.slider-next')

        const tabs = section.querySelectorAll('.slider-tab')

        const scroll = (direction) => {
            sliders.forEach((slider) => slider.embla?.[direction]())
        }

        prevBtns.forEach((btn) => btn.addEventListener('click', () => scroll('scrollPrev')))

        nextBtns.forEach((btn) => btn.addEventListener('click', () => scroll('scrollNext')))

        if (tabs.length) {
            tabs.forEach((tab, index) => {
                tab.addEventListener('click', () => {
                    sliders.forEach((slider) => slider.embla?.scrollTo(index))
                })
            })
        }
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
        this.isLoop = element.classList.contains('no-loop') ? false : true

        if (window.innerWidth <= 482) {
            this.isCentered = true
        }

        this.embla = EmblaCarousel(
            element,
            {
                loop: this.isLoop,
                align: this.isCentered ? 'center' : 'start',
            },
            [ClassNames()]
        )
    }
}

class GallerySlider {
    constructor(element, section) {
        this.section = section
        this.preview = section.querySelector('.slider-preview img')
        this.slides = element.querySelectorAll('.embla__slide')

        this.embla = EmblaCarousel(
            element,
            {
                loop: true,
                axis: 'y',
                align: 'start',
            },
            [ClassNames()]
        )

        this.dotsNode = section.querySelector('.embla__dots')
        if (this.dotsNode) addDotButtonAndClickHandlers(this.embla, this.dotsNode)

        // Update preview on slide change
        this.embla.on('select', () => {
            this.updatePreview()
        })

        // Click on any slide to make it active and update preview
        this.slides.forEach((slide, index) => {
            slide.addEventListener('click', () => {
                this.embla.scrollTo(index)
            })
        })

        // Set initial preview
        this.updatePreview()
    }

    updatePreview() {
        if (!this.preview) return
        const selectedIndex = this.embla.selectedScrollSnap()
        const activeSlide = this.slides[selectedIndex]
        if (activeSlide) {
            const img = activeSlide.querySelector('img')
            if (img) {
                this.preview.src = img.src
                this.preview.alt = img.alt
            }
        }
    }
}
