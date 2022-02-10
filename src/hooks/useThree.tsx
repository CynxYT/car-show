import React, { useEffect, useRef } from "react";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


export default function useThree() {

    const positionRef = useRef({
        mouseX: 0,
        mouseY: 0,
        destinationX: 0,
        destinationY: 0,
        distanceX: 0,
        distanceY: 0,
        key: -1,
      });


    useEffect(() => {


        // ----- Start with scene -----
        // Canvas
        const canvas = document.querySelector('canvas.webgl') as HTMLElement;
        
        // Scene
        const scene = new THREE.Scene();
        
        // Objects
        const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
        
        // Materials
        
        const material = new THREE.MeshStandardMaterial();
        material.metalness = 0.3;
        material.roughness = 0.6;
        material.color = new THREE.Color(0x2194ce);
        
        // Mesh
        const sphere = new THREE.Mesh(geometry,material);
        scene.add(sphere)


        
        // Lights
        
        const fill = new THREE.PointLight(0xffffff, 1);
        fill.position.x = -2;
        fill.position.y = 2;
        fill.position.z = 4;
        scene.add(fill);

        const key = new THREE.PointLight(0xffffff, 0.3);
        key.position.set(1,2,3);
        scene.add(key);

        const back = new THREE.PointLight(0xffffff, 0.2);
        back.position.x = 1;
        back.position.y = -1;
        back.position.z = -3;
        scene.add(back);
        
        /**
         * Sizes
         */
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
        }

        var camX = 0;
        let camY = 0;
        let camZ = 0;

        
        /**
         * Camera
         */
        // Base camera
        var camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
        camera.position.set(camX,camY,camZ + 2);
        scene.add(camera);


        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
        })
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        
        /**
         * Animate
         */

        document.onmousemove = (event) => {
            const { clientX, clientY } = event;

            const mouseX = clientX;
            const mouseY = clientY;
 

            camX = (event.clientX - window.innerWidth / 2) / 5000;
            camY = -(event.clientY - window.innerHeight / 2) / 5000;
            sphere.rotation.x = -((event.clientY - (window.innerHeight / 2)) / 2500);
            sphere.rotation.y = -((event.clientX - (window.innerWidth / 2)) / 2500);

            if (camera.position.x !== null && camera.position.y !== null) {
                positionRef.current.mouseX = mouseX - (event.clientX - window.innerWidth / 2);
                positionRef.current.mouseY = mouseY - (event.clientY - window.innerHeight / 2);
            }
        }
        
        const clock = new THREE.Clock()
        
        const tick = () => {
        
            const elapsedTime = clock.getElapsedTime()
        
            // Update objects
        
            // Update Orbital Controls
            // controls.update()
        
            // Render
            renderer.render(scene, camera);
        
            // Call tick again on the next frame
            window.requestAnimationFrame(tick);
        }

        const followMouse = () => {
            positionRef.current.key = requestAnimationFrame(followMouse);
            const {
              mouseX,
              mouseY,
              destinationX,
              destinationY,
              distanceX,
              distanceY,
            } = positionRef.current;
            if (!destinationX || !destinationY) {
              positionRef.current.destinationX = mouseX;
              positionRef.current.destinationY = mouseY;
            } else {
              positionRef.current.distanceX = (mouseX - destinationX) / 5;
              positionRef.current.distanceY = (mouseY - destinationY) / 5;
              if (
                Math.abs(positionRef.current.distanceX) +
                  Math.abs(positionRef.current.distanceY) <
                0.1
              ) {
                positionRef.current.destinationX = mouseX;
                positionRef.current.destinationY = mouseY;
              } else {
                positionRef.current.destinationX += distanceX;
                positionRef.current.destinationY += distanceY;
              }
            }

            camX = (destinationX - window.innerWidth / 2) / 5000;
            camY = -(destinationY - window.innerHeight / 2) / 5000;
            sphere.rotation.x = -((destinationX - (window.innerHeight / 2)) / 2500);
            sphere.rotation.y = -((destinationY - (window.innerWidth / 2)) / 2500);
            camera.position.set(camX, camY, camZ + 2);
          };

            followMouse();
        
        tick();

    },[]);
}