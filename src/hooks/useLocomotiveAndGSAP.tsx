import { useEffect } from "react";
import { gsap } from "gsap";
import LocomotiveScroll from "locomotive-scroll";
import { ScrollTrigger } from "gsap/all";



export default function useLocomotiveAndGSAP() {


    useEffect(() => {

        const locoScroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true,
            direction: "vertical",
            reloadOnContextChange: true,
            // mobile: {
            //     smooth: true,
            //     breakpoint: 0,
            // },
            // tablet: {
            //     smooth: true,
            //     breakpoint: 0,
            // },
            multiplier: 0.5,
            firefoxMultiplier: 1.2,
        }, []);

        gsap.registerPlugin(ScrollTrigger);

        locoScroll.on("scroll", ScrollTrigger.update);


        ScrollTrigger.scrollerProxy(".sections-container", {
            scrollTop(value) {
                return arguments.length?locoScroll.scrollTo(value,0,0):
                locoScroll.scroll.instance.scroll.y;
            },
            getBoundingClientRect() {
                return {top: 0, left:0, width: window.innerWidth, height: window.innerHeight};
            },
            pinType: (document.querySelector(".sections-container") as HTMLElement).style.transform ? "transform" : "fixed",
        });

        

        ScrollTrigger.refresh();

    }, []);

    
    // let list = document.querySelectorAll(".c-scrollbar");

    // if(list.length === 1) {
    //     list.forEach((x) => {
    //         x.parentNode?.removeChild(x);
    //     })
    // }
}