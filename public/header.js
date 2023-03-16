gsap.registerPlugin(ScrollTrigger);

/*gsap.from(".big-text2", {
    scrollTrigger: {
        trigger: ".big-text2",
        end: "-500px top",
        scrub: true,
        toggleActions: "play pause reverse pause",
    },
    y:100,
    opacity: 0,
    duration: 0.5,
});*/

gsap.to(".img-1", {
    scrollTrigger: {
        trigger: ".img-1",
        start: "450px 80%",
        scrub: 1,
        toggleActions: "play pause reverse pause",
    },
    x: -250,
    opacity: 0,
    duration: 1,
})
gsap.to(".img-2", {
    scrollTrigger: {
        trigger: ".img-2",

        start: "450px 80%",
        scrub: 0.3,
        toggleActions: "play pause reverse pause",
    },
    y: -150,
    opacity: 0,
    duration: 0.5,
})
gsap.to(".img-3", {
    scrollTrigger: {
        trigger: ".img-3",
        start: "450px 80%",
        scrub: 1,
        toggleActions: "play pause reverse pause",
    },
    x: 250,
    opacity: 0,
    duration: 1,
})
// gsap.to(".big-text", {
//     scrollTrigger: {
//         trigger: ".img-3",
//         start: "bottom 80%",
//         scrub: 1,
//         toggleActions: "play pause reverse pause",
//     }, 
//     x: -2000,
//     duration: 0.5,
// })
// gsap.to(".big-text3", {
//     scrollTrigger: {
//         trigger: ".img-3",
//         start: "bottom 80%",
//         scrub: 1,
//         toggleActions: "play pause reverse pause",
//     }, 
//     x: 2000,
//     duration: 0.5,
// })