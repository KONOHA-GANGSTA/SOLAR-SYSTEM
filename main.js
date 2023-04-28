import * as THREE from 'three';

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,1000);
camera.position.z = 100;

function makeSystObject(size,color,type = "standart"){
    let geometry = new THREE.SphereGeometry(size, 32, 32);
    let material = (type == "standart")? new THREE.MeshStandardMaterial({color: color}) : new THREE.MeshBasicMaterial({color: color});
    let obj = new THREE.Mesh(geometry, material);
    return obj;
}

function setDefaults(planet,orbRadius){
    planet.position.set(orbRadius,0,0);
    //planet.castShadow = true;
    planet.receiveShadow = true;
    return planet;
}



let sol = makeSystObject(7,0xFF9900,"basic");
sol.position.set(0,0,0);
scene.add(sol);
let mercurius = setDefaults(makeSystObject(1,0xf2e8c9),11);
let venus = setDefaults(makeSystObject(2,0xffa500),15);
let terra = setDefaults(makeSystObject(3,0x6495ed),22);
let mars = setDefaults(makeSystObject(2,0xff2b2b),29);
let jupiter = setDefaults(makeSystObject(5,0xefcdb8),42);
let saturn = setDefaults(makeSystObject(4,0xf2ddc6),57);
let uranus = setDefaults(makeSystObject(3,0x87cefa),71);
let neptune = setDefaults(makeSystObject(2,0x082567),83);

let orbitPoint = new THREE.Object3D();
orbitPoint.position.set(0, 0, 0);

function createRot(planet){
    let group = new THREE.Group();
    group.add(planet);
    group.add(orbitPoint);
    return group;
}

let mercRot = createRot(mercurius);
scene.add(mercRot);
let venRot = createRot(venus);
scene.add(venRot);
let terRot = createRot(terra);
scene.add(terRot);
let marsRot = createRot(mars);
scene.add(marsRot);
let jupRot = createRot(jupiter);
scene.add(jupRot);
let satRot = createRot(saturn);
scene.add(satRot);
let uRot = createRot(uranus);
scene.add(uRot);
let nepRot = createRot(neptune);
scene.add(nepRot);


let renderer = new THREE.WebGL1Renderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x010616, 1 );
renderer.shadowMap.enabled = true;




let light = new THREE.PointLight(0xffffff, 1);
light.position.set(0, 0, 0);
light.castShadow = true;
scene.add(light);

document.body.appendChild( renderer.domElement );

let boost = 1;


let camAngel = 0;



function animate() {

    requestAnimationFrame( animate );
    mercRot.rotation.z+=0.05*boost;
    venRot.rotation.z+=0.01*boost;
    terRot.rotation.z+=0.005*boost;
    marsRot.rotation.z+=0.001*boost;
    jupRot.rotation.z+=0.0005*boost;
    satRot.rotation.z+=0.0001*boost;
    uRot.rotation.z += 0.00005*boost;
    nepRot.rotation.z+=0.00001*boost;


    renderer.render( scene, camera );

 }

 animate();
