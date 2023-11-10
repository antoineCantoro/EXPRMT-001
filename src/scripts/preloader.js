import { gsap } from "gsap"
import imagesLoaded from "imagesloaded"
import FontFaceObserver from "fontfaceobserver"

import SplitType from 'split-type'

export default class Preloader {

    constructor(carousel, sizes) {
        
        this.helloTextEl = document.querySelector(".preloader-hello")
        this.preloaderGridEl = document.querySelector('.preloader-grid')
        this.pixels = []
        this.sizes = sizes
        
        this.helloList = [
            "Hééé adishat",
            "Hey there",
            "Guten tag",
            "Bună ziua",
            "Dobrý deň"
        ]
        
        this.helloID = this.getRandomInt(0, this.helloList.length - 1)

        this.setHelloText()
        this.carousel = carousel;


        const pixelCount = window.innerWidth < 1024 ? 12 : 20
        this.createPreloaderGrid(pixelCount);
        

        // Glitch text effect
        // https://codepen.io/xoihazard/pen/QJVEJj
        
    }

    setHelloText() {
        this.helloTextEl.innerHTML = this.helloList[this.helloID]

    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    createPreloaderGrid(pixelRowCount) {
        
        const pixelSize = this.sizes.width / pixelRowCount
        this.preloaderGridEl.style.gridTemplateColumns = `repeat(${ pixelRowCount }, 1fr)`

        for (let i = 0; i < pixelRowCount; i++) {

            // Create div and append it to grid wrapper
            const divElement = document.createElement('div')
                  divElement.classList.add("pixel-column")
            this.preloaderGridEl.appendChild(divElement)

            for (let j = 0; j < this.sizes.height ; j += pixelSize) {
                const cellElement = document.createElement('div')
                      cellElement.classList.add("cell-item")
                divElement.appendChild(cellElement)
            }
        }
        
        imagesLoaded( document.querySelector('.images-wrapper'), () => {
            console.log('Images has loaded.');
            
            new FontFaceObserver('NeueBit')
                .load()
                .then(() => {
                    console.log('NeueBit has loaded.');
                    this.hidePreloader()
                    this.carousel.splitTextes()
                });
        });

    }

    hidePreloader() {
        gsap.timeline({ delay: 1 })
            .set([".preloader-credit", ".preloader-hello"], {
                autoAlpha: 0,
                stagger: 0.5
            })
            .set('.cell-item', {
                autoAlpha: 0, 
                stagger: {
                    from: "random",
                    amount: 0.5,
                }, 
                onComplete: () => {
                    this.carousel.showSlide(0)
                }
            })
            .set('.preloader', {
                autoAlpha: 0,
            })
    }
    
}