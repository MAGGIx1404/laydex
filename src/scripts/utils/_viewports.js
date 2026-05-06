export function setDynamicVH() {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    document.documentElement.style.setProperty('--h', `${window.innerHeight}px`)
}
