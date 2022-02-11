import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


export default function useThree() {


    useEffect(() => {

        // ------------------- Object -------------------

        const canvas = document.querySelector('.home-three-object') as HTMLElement;
        const scene = new THREE.Scene();
        const loader = new GLTFLoader();
        const distance = 6;
        
        loader.load( process.env.PUBLIC_URL + "../models/s13.glb", ( gltf ) => {
          const file = gltf;
          file.scene.rotateY(1)
          scene.add( file.scene );
        
        }, undefined, function ( error ) {
        
          console.error( error );
        
        } );



        // ------------------- Object -------------------
        const geometry = new THREE.BoxGeometry( 1, 1, 1);
        
       



        // ------------------- Material -------------------
        const material = new THREE.MeshStandardMaterial();
        material.metalness = 0.025;
        material.roughness = 0.5;
        material.color = new THREE.Color(0x2194ce);
        



        // ------------------- Mesh -------------------
        const cube = new THREE.Mesh(geometry,material);
        // scene.add(cube)


        
        
        // ------------------- Lights -------------------
        const fill = new THREE.PointLight(0xffffff, 1);
        fill.position.set(-2, 5, 4);
        scene.add(fill);

        const key = new THREE.PointLight(0xffffff, 1.2);
        key.position.set(1, 1, 1);
        scene.add(key);

        const back = new THREE.PointLight(0xffffff, 0.2);
        back.position.set(3, -1, -8);
        scene.add(back);





   
        // ------------------- Sizes -------------------
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
        }




        // ------------------- Camera -------------------
        var camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
        camera.position.set(0,0, distance);
        scene.add(camera);

        const cursor = { x : 0 , y : 0, z : distance}
        document.onmousemove = (event) => {
          cursor.x = (event.clientX / window.innerWidth) - 0.5;
          cursor.y = (event.clientY / window.innerHeight) - 0.5;
          cursor.z = -Math.abs((event.clientX / window.innerWidth) - 0.5) + distance;
        }




        // ------------------- Renderer -------------------
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
        })
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        



        // ------------------- Clock + instance -------------------
        // const clock = new THREE.Clock()

        const tick = () => {
      
            // const elapsedTime = clock.getElapsedTime()
        
            const cameraX = cursor.x * 5;
            const cameraY = - cursor.y * 5;
            const cameraZ = cursor.z

            camera.rotation.x += (-cameraY / 4 - camera.rotation.x) / 15;
            camera.rotation.y += (cameraX / 4 - camera.rotation.y) / 15;
            camera.position.x += (cameraX - camera.position.x) / 15;
            camera.position.y += (cameraY - camera.position.y) / 15;
            camera.position.z += (cameraZ - camera.position.z) / 15;

            renderer.render(scene, camera);

            window.requestAnimationFrame(tick);
        }
        
        tick();

    },[]);
}