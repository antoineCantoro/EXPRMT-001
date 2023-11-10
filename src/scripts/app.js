import * as THREE from 'three'

import vertexShader from '../shaders/vertex.glsl'
import fragmentShader from '../shaders/fragment.glsl'
import Preloader from './preloader'
import Carousel from './carousel'
import { lerp, clamp } from 'three/src/math/MathUtils'

import { gsap } from "gsap"
import SplitType from 'split-type'

let time = 0

// Camera
const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
camera.position.z = 1;


// Scene
const scene = new THREE.Scene();


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

function getScreenSize() {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    getScreenSize();

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// Cursor
let mouse = new THREE.Vector2(0, 0)
const cursor = {
    x: sizes.width / 2, y: sizes.height / 2
}
const currentCursor = {
    x: sizes.width / 2, y: sizes.height / 2
}
const targetCursor = {
    x: sizes.width / 2, y: sizes.height / 2
}

const diff = {
    x: 0, y:0
}

function updateCursor() {
    targetCursor.x = lerp(cursor.x, targetCursor.x, 0.9)
    targetCursor.y = lerp(cursor.y, targetCursor.y, 0.9)

    mouse.x = (targetCursor.x / sizes.width) - 0.5
    mouse.y = (targetCursor.y / sizes.height) - 0.5


}

window.addEventListener("mousemove", (e) => {
    cursor.x = e.clientX
    cursor.y = e.clientY
})


/**
 * Textures
 */
const imageElements = [...document.querySelectorAll("img")]
const textureLoader = new THREE.TextureLoader()
const imageTextures = imageElements.map(el => textureLoader.load(el.getAttribute("src")))

const slideCount = imageElements.length
let oldFrame = 0
let currentFrame = 0


// OBJECTS

const planeMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
        uMouse: { value: mouse },
        uTexture1: { value: imageTextures[oldFrame] },
        uTexture2: { value: imageTextures[currentFrame] },
        uTime: { value: time },
        uProgress: { value: 0 },
        uOffset: { value: new THREE.Vector2(0.0, 0.0) },
        uPixel: { value: 512 }
    }
})

const planeGeometry = new THREE.PlaneGeometry( 
    1 * 0.75, 
    551 / 448 * 0.75, 
    128, 128 
);
const planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );
scene.add( planeMesh );


// Renderer
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xffffff, 0);
// renderer.setAnimationLoop( raf );
document.body.appendChild( renderer.domElement );

// Animation

function raf() {

    time++;

    updateCursor();
    let test = 1 - clamp(Math.abs(targetCursor.x / cursor.x), -1, 1)

    // console.log(test);

    planeMaterial.uniforms.uOffset.value.set(test, mouse.y)
    planeMaterial.uniforms.uTime.value = time
	renderer.render( scene, camera );

    requestAnimationFrame(raf)

}
raf()


const carousel = new Carousel(sizes);
new Preloader(carousel, sizes);


// Buttons
const previousButton = document.querySelector(".button--previous")
const nextButton = document.querySelector(".button--next")

let isAnimating = false

previousButton.addEventListener("click", goPrevious)
nextButton.addEventListener("click", goNext)

function goPrevious() {
    if (isAnimating) return
    oldFrame = currentFrame

    if (currentFrame == 0) {
        currentFrame = slideCount - 1
    } else {
        currentFrame--
    }

    animateTexture()    
    setCurrentActiveLabel(oldFrame, currentFrame)

    carousel.hideSlide(oldFrame)
    carousel.showSlide(currentFrame)
}

function goNext() {
    if (isAnimating) return

    oldFrame = currentFrame

    if (currentFrame == slideCount - 1) {
        currentFrame = 0
    } else {
        currentFrame++
    }

    planeMaterial.uniforms.uTexture1.value = imageTextures[oldFrame];
    planeMaterial.uniforms.uTexture2.value = imageTextures[currentFrame];

    animateTexture()
    setCurrentActiveLabel(oldFrame, currentFrame)

    carousel.hideSlide(oldFrame)
    carousel.showSlide(currentFrame)
}

const labels = document.querySelectorAll(".label")
function setCurrentActiveLabel(oldElIndex, newElIndex) {
    labels[oldElIndex].classList.remove('--active')
    labels[newElIndex].classList.add('--active')
}

function animateTexture() {
    if (isAnimating) return

    planeMaterial.uniforms.uTexture1.value = imageTextures[oldFrame];
    planeMaterial.uniforms.uTexture2.value = imageTextures[currentFrame];

    gsap.to(planeMaterial.uniforms.uProgress, {
        value: 1,
        duration: 0.5,
        delay: 0.25,
        ease: "Power4.inOut",
        onStart: () => {
            isAnimating = true
        },
        onComplete: () => {
            planeMaterial.uniforms.uTexture1.value = imageTextures[currentFrame];
            planeMaterial.uniforms.uProgress.value = 0;
        }
    })

    gsap.to(planeMaterial.uniforms.uPixel, {
        value: 64,
        duration: 0.5,
        ease: "Power4.in",
    }) 
    gsap.to(planeMaterial.uniforms.uPixel, {
        value: 512,
        duration: 0.5,
        delay: 0.5,
        ease: "Power4.out",
        onComplete: () => {
            isAnimating = false
        }
    }) 
}