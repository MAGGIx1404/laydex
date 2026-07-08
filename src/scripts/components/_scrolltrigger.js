import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default class ScrollAnimations {
    constructor(section) {
        this.section = section
        this.panels = section.querySelectorAll('.why-panel')
        if (!this.panels.length) return

        this.init()
    }

    init() {
        const panels = this.panels
        const panelCount = panels.length

        // Set first panel active by default
        gsap.set(panels[0], { opacity: 1, zIndex: 1 })
        for (let i = 1; i < panelCount; i++) {
            gsap.set(panels[i], { opacity: 0, zIndex: 0 })
        }

        // Pin the section and create a scroll-driven timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: this.section,
                start: 'top top',
                end: `+=${panelCount * 100}%`,
                pin: true,
                scrub: true,
            },
        })

        // For each panel transition: fade out current, fade in next
        for (let i = 0; i < panelCount - 1; i++) {
            tl.to(panels[i], { opacity: 0, zIndex: 0 })
            tl.to(panels[i + 1], { opacity: 1, zIndex: 1 }, '<')
        }
    }
}
