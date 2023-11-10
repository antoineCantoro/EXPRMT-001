import { gsap } from "gsap"
import SplitType from 'split-type'

export default class Carousel {

    constructor() {
        this.currentIndex = 0
        this.nextIndex = 0

        this.slidesEl = document.querySelectorAll(".slide")

        this.splitTextes()
    }

    splitTextes() {
        const paragraphes = document.querySelectorAll("p")        
        // console.log(paragraphes)

        paragraphes.forEach((el) => {
            new SplitType(el, {types: 'lines', lineClass: 'line-wrapper'})

            el.querySelectorAll(".line-wrapper").forEach((line) => {
                // console.log(line);
                new SplitType(line, {types: 'lines'})
            })
        })

    }

    showSlide(idx) {
        const slideEl = this.slidesEl[idx]

        this.showLines(slideEl)
        this.showTitle(slideEl)
    }
    hideSlide(idx) {
        const slideEl = this.slidesEl[idx]
        this.hideLines(slideEl)
        this.hideTitle(slideEl)
    }
    
    showLines(slideEl) {
        console.log(slideEl);
        const lines = slideEl.querySelectorAll('p .line')
        gsap.to(lines, { 
            y: "0", 
            duration: 2,
            delay: 1,
            ease: "expo.out", 
            stagger: 0.02
        })
    }

    hideLines(slideEl) {
        const lines = slideEl.querySelectorAll('p .line')
        gsap.to(lines, {y: "100%", duration: 2, ease: "expo.out", stagger: -0.02})
    }

    showTitle(slideEl) {
        const lines = slideEl.querySelectorAll('h1 .line')
        gsap.to(lines, {y: "0%", duration: 1.5, delay: 0.5, ease: "expo.out", stagger: -0.1})
    }
    hideTitle(slideEl) {
        const lines = slideEl.querySelectorAll('h1 .line')
        gsap.to(lines, {y: "-100%", duration: 1.5, ease: "expo.out", stagger: 0.1, clearProps: true})
    }
    

}