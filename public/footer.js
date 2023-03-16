gsap.registerPlugin(ScrollTrigger);

gsap.to(".social", {
    scrollTrigger: {
        trigger: ".social",
        toggleActions: "play pause reverse pause",
    },
    opacity: 1,
    width:'80%',
    duration: 1,
})
gsap.to(".fa-brands", {
    scrollTrigger: {
        trigger: ".fa-brands",
        toggleActions: "play pause reverse pause",
    },
    opacity: 1,
    duration: 1,
})