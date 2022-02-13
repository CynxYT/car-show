import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { ReflectorForSSRPass } from 'three/examples/jsm/objects/ReflectorForSSRPass.js';
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';


export default function useThree() {

    const params = {
      enableSSR: true,
      groundReflector: false,
      exposure: 0.1,
      bloomStrength: 0.4,
      bloomThreshold: 0,
      bloomRadius: 0.7
    };

    const selects: THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>[] | null = [];


    useEffect(() => {

        // ------------------- Object -------------------

        const canvas = document.querySelector('.home-three-object') as HTMLElement;
        const scene = new THREE.Scene();
        const loader = new GLTFLoader();
        const distance = 6;
        
        // loader.load( process.env.PUBLIC_URL + "../models/s13.glb", ( gltf ) => {
        //   const file = gltf;
        //   file.scene.rotateY(0.8);
        //   file.scene.translateX(1);
        //   file.scene.translateZ(-1);
        //   scene.add( file.scene );
        
        // }, undefined, function ( error ) {
        
        //   console.error( error );
        
        // } );

  
        // ------------------- Object -------------------
        const cube = new THREE.BoxGeometry( 1, 1, 1);
        const cubeMaterial = new THREE.MeshStandardMaterial( { color: 0x808080, roughness: 0.1, metalness: 0 } );
				const cubesMaterial = new THREE.Mesh( cube, cubeMaterial );
        cubesMaterial.position.y = 0.75;
        scene.add(cubesMaterial);
        
       



        // ------------------- Material -------------------
        const geoFloor = new THREE.BoxGeometry( 12, 0.05, 6 );
				const matStdFloor = new THREE.MeshStandardMaterial( { color: 0x202020, roughness: 0, metalness: 0 } );
				const mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
				scene.add( mshStdFloor );
        

        
        
        // ------------------- Lights -------------------

        RectAreaLightUniformsLib.init();

        const rectLight1 = new THREE.RectAreaLight( 0xffffff, 1, 1.5, 3 );
				rectLight1.position.set( -4, 1, -5 );
        rectLight1.rotateY(3.4);
				scene.add( rectLight1 );
        scene.add( new RectAreaLightHelper( rectLight1 ) );

        const rectLight2 = new THREE.RectAreaLight( 0xffffff, 1, 1.5, 3 );
				rectLight2.position.set( 0, 1, -5 );
        rectLight2.rotateY(3.15);
				scene.add( rectLight2 );
        scene.add( new RectAreaLightHelper( rectLight2 ) );

        const rectLight3 = new THREE.RectAreaLight( 0xffffff, 1, 1.5, 3 );
				rectLight3.position.set( 4, 1, -5 );
        rectLight3.rotateY(2.9);
				scene.add( rectLight3 );
        scene.add( new RectAreaLightHelper( rectLight3 ) );

        const light = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(light);

        // const dirlight = new THREE.DirectionalLight(0xffffff, 0.5);
        // dirlight.position.set(-4, 15, 2);
        // dirlight.target.position.set(-1,0,0);
        // scene.add(dirlight);
        // scene.add(dirlight.target);


        // const geometry = new THREE.PlaneBufferGeometry( 1, 1 );
        // const groundReflector = new ReflectorForSSRPass( geometry, {
        //   clipBias: 0.0003,
        //   textureWidth: window.innerWidth,
        //   textureHeight: window.innerHeight,
        //   color: 0x888888,
        //   useDepthTexture: true,
        // } );
        // groundReflector.material.depthWrite = false;
        // groundReflector.rotation.x = - Math.PI / 2;
        // groundReflector.visible = false;
        // scene.add( groundReflector );


   
        // ------------------- Sizes -------------------
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
        }




        // ------------------- Camera -------------------
        var camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 100);
        camera.position.set(0,0, distance);
        scene.add(camera);

        const cursor = { x : 0 , y : -0.7, z : distance}
        document.onmousemove = (event) => {
          cursor.x = (event.clientX / window.innerWidth) - 0.5;
          cursor.y = ((event.clientY / window.innerHeight) - 1.2);
          cursor.z = -Math.abs((event.clientX / window.innerWidth) - 0.5) + distance;
        }




        // ------------------- Renderer -------------------
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            // antialias: true,
        })
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        

        const composer = new EffectComposer( renderer );
        const ssrPass = new SSRPass( {
          renderer,
          scene,
          camera,
          width: window.innerWidth,
          height: window.innerHeight,
          groundReflector: null,
          selects: params.groundReflector ? selects : null
        } );

        const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
        bloomPass.threshold = params.bloomThreshold;
        bloomPass.strength = params.bloomStrength;
        bloomPass.radius = params.bloomRadius;

        // composer.addPass( renderScene );

        ssrPass.thickness = 0;
        ssrPass.isInfiniteThick = false;
        
        // composer.addPass( ssrPass );
        // composer.addPass( new ShaderPass( GammaCorrectionShader ) );
        composer.addPass ( new RenderPass( scene, camera ))
        composer.addPass( bloomPass );

    
        // groundReflector.fresnel = false;//ssrPass.isFresnel;
        // groundReflector.distanceAttenuation = true;//ssrPass.isDistanceAttenuation;
        // groundReflector.maxDistance = 0.1;//ssrPass.maxDistance;




        // ------------------- Clock + instance -------------------
        // const clock = new THREE.Clock()

        const tick = () => {
      
            // const elapsedTime = clock.getElapsedTime()
        
            const cameraX = cursor.x * 8;
            const cameraY = - cursor.y;
            const cameraZ = cursor.z

            camera.rotation.x += (-cameraY / 4 + 0.1 - camera.rotation.x) / 15;
            camera.rotation.y += (cameraX / 6 - camera.rotation.y) / 15;
            camera.position.x += (cameraX - camera.position.x) / 15;
            camera.position.y += (cameraY + 0.5 - camera.position.y) / 15;
            camera.position.z += (cameraZ - camera.position.z) / 15;

            // renderer.render(scene, camera);

            composer.render();

            window.requestAnimationFrame(tick);
        }
        
        tick();

    },[]);
}