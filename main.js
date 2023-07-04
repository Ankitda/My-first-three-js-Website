import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from "gsap";
import "./style.css";

let scene,camera,renderer,sphere,directionalLight,directionalLightHelper,pointLight,pointLightHelper,torus;
let orbit, gsapAnimation, clock, particles;
let canvas;
clock = new THREE.Clock();  

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    canvas = document.querySelector('.webgl');

    renderer = new THREE.WebGLRenderer({canvas,antialias : true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio(2);
    document.body.appendChild( renderer.domElement );
   
    pointLight = new THREE.PointLight(0xffffff, 3.5, 25);
    pointLight.position.set(8,18,4)
    scene.add(pointLight);


    directionalLight = new THREE.DirectionalLight(0xffffff,1.25);
    directionalLight.position.set(8,8,5);
    // directionalLight.castShadow = true;
    directionalLight.target.position.set(0,0,0);
    scene.add(directionalLight);
    scene.add(directionalLight.target);

    // directionalLightHelper =  new THREE.DirectionalLightHelper( directionalLight, 1);
    // scene.add(directionalLightHelper);

    // pointLightHelper =  new THREE.PointLightHelper( pointLight, 1);
    // scene.add(pointLightHelper);

    
    const geometry = new THREE.SphereGeometry(3.5, 64, 64);
    // const texture = new THREE.TextureLoader().load('texture/download.jpeg')
    const sphereMaterial = new THREE.MeshStandardMaterial({color : 0xffffff , wireframe : false, roughness : 0.48, metalness : 0.8});
    sphere = new THREE.Mesh( geometry, sphereMaterial );
    scene.add( sphere );

    const torusGeometry = new THREE.TorusGeometry( 6, 1.8, 64, 64 ); 
    const torusMaterial = new THREE.MeshStandardMaterial({color : 0xffffff , wireframe : false, roughness : 0.1, metalness : 1});
    torus = new THREE.Mesh( torusGeometry, torusMaterial); 
    scene.add( torus );

    
    orbit = new OrbitControls(camera,canvas);
    orbit.update();
    orbit.autoRotate = true;
    orbit.autoRotateSpeed = 1.5;
    orbit.enableZoom = false;
    orbit.enablePan = false;
    orbit.maxPolarAngle = Math.PI/2;
    

    gsapAnimation = gsap.timeline({defaults : {duration : 1}})
    gsapAnimation.fromTo(sphere.scale, {z : 0, x : 0, y : 0},{z : 1, x : 1, y : 1})
    gsapAnimation.fromTo(torus.scale, {z : 0, x : 0, y : 0},{z : 0.2, x : 1, y : 1})
    gsapAnimation.fromTo("nav",{y : "-100%"}, {y : "0%"})
    gsapAnimation.fromTo(".title",{opacity : 0}, {opacity : 1})
  

    //let Animate
    let mouseDown  = false;
    let rgb = [];
    window.addEventListener("mousedown", ()=>{
        mouseDown = true;
    })
    window.addEventListener("mouseup", ()=>{
        mouseDown = false;
    })
    window.addEventListener("mousemove", (e)=>{
        if(mouseDown){
            rgb = [
                Math.round((e.pageX/window.innerWidth)*255),
                Math.round((e.pageY/window.innerHeight)*255),
                255
            ]
            let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
            gsap.to(sphere.material.color,{r : newColor.r, g : newColor.g, b : newColor.b})
            gsap.to(torus.material.color,{r : newColor.r, g : newColor.g, b : newColor.b})

        }
    })

    
    camera.position.set(0,0,20);

    addingParticles();
}

function animate() {
	requestAnimationFrame( animate );

	sphere.rotation.x += 0.01;
	sphere.rotation.y += 0.01;
	torus.rotation.y += 0.01;
    torus.rotation.x += 0.01;
	
    const elaspedTime = clock.getElapsedTime();

    particles.position.y = -elaspedTime * 0.2;

    orbit.update();
	renderer.render( scene, camera );
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}

function addingParticles(){
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 50000;

    const position = new Float32Array(count * 3);

    for(let i=0; i<count*3; i++){
        position[i]= (Math.random() - 0.5)*50;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color : 0xff00ff,
        size : 0.05 
    });
    particlesMaterial.size = 0.01;
    particlesMaterial.sizeAttenuation = true;

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
}

window.addEventListener('resize', onWindowResize, false);

init();
animate();