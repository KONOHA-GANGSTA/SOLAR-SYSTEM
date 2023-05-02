import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



function loadModel(name,size,orbitRadius) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load('models/'+name+"/scene.gltf", (gltf) => {
        gltf.scene.position.set(orbitRadius,0,0);
        gltf.scene.rotateX(Math.PI/2);
        gltf.scene.scale.set(size, size, size);
      resolve(gltf.scene);
    }, undefined, ( error ) => {
      console.error( error );
      reject(error);
    })
  });
}

const allModelsPromise = Promise.all([
  loadModel("sun",1,0),
  loadModel("merc",0.01,15),
  loadModel("venus",1,18),
  loadModel("earth",0.02,22),
  loadModel("mars",3,30),
  loadModel("jupiter",2,40),
  loadModel("saturn",0.008,55),
  loadModel("uranus",0.01,65),
  loadModel("neptune",0.1,80),
]);



let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,1000);
camera.position.set(0,0,80);
let lookTo = "system";

let orbitPoint = new THREE.Object3D();
orbitPoint.position.set(0, 0, 0);

function createRot(planet){
    let group = new THREE.Group();
    group.add(planet);
    group.add(orbitPoint);
    return group;
}

allModelsPromise
.then((arr) => {
    let mercRot = createRot(arr[1]);
    scene.add(mercRot);
    let venRot = createRot(arr[2]);
    scene.add(venRot);
    scene.add(arr[0])
    let terRot = createRot(arr[3]);
    scene.add(terRot);
    let marsRot = createRot(arr[4]);
    scene.add(marsRot);
    let jupRot = createRot(arr[5]);
    scene.add(jupRot);
    let satRot = createRot(arr[6]);
    scene.add(satRot);
    let uRot = createRot(arr[7]);
    scene.add(uRot);
    let nepRot = createRot(arr[8]);
    scene.add(nepRot);

    function show(planet){
        switch(planet){
            case "system":{
                camera.position.set(0,0,100);
                lookTo= "system";
                break;
            }
            default:{
                camera.position.set(0,0,100);
                camera.lookAt(arr[0].position);
                camera.rotateY(Math.PI/2)
                camera.rotateX(-Math.PI/12*10)
                camera.rotateZ(Math.PI/2);
                lookTo = planet;
                camera.rotateY(camAngel[[...planetProps.keys()].indexOf(lookTo)]);
                break;
            }
        }
    }

    document.querySelector(".menue").querySelectorAll("DIV").forEach(el =>{
        let info = document.getElementById("info");
        if(el.id=="info") return;
        el.addEventListener("click",()=>{
            if(el.classList.contains("selected")){
                el.classList.remove("selected");
                show("system");
                info.classList.add("hid")
                return;
            }
            else{
                document.querySelector(".menue").querySelectorAll("DIV").forEach(e=>e.classList.remove("selected"));
                el.classList.add("selected");
                info.classList.remove("hid");
                fill(dataMap.get(el.id));
            }
        show(el.id);
        })
    })

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
        //terra.rotation.z+=0.01;
        let j = 0;
        arr.forEach(el=>{
            if(++j == 8)
            el.rotateX(0.01);
            else
            el.rotateY(0.01)}
            )
        let i = 0;
        for(let value of [...planetProps.values()])
            camAngel[i++]+=value.coef*boost;
        i = [...planetProps.keys()].indexOf(lookTo);
    
    
    
        switch(lookTo){
            case "system":{
                camera.lookAt(arr[0].position)
                break;
            }
            default:{
                camera.position.set(planetProps.get(lookTo).radius*Math.cos(camAngel[i]),planetProps.get(lookTo).radius*Math.sin(camAngel[i]),0);
                camera.rotateY(planetProps.get(lookTo).coef);
                break;
            }
        }
    
        renderer.render( scene, camera );
    
     }
     
     animate();
  });



let planetProps = new Map();
planetProps.set("mercurius",{radius:9,coef:0.05});
planetProps.set("venus",{radius:15,coef:0.01});
planetProps.set("earth",{radius:16,coef:0.005});
planetProps.set("mars",{radius:25,coef:0.001});
planetProps.set("jupiter",{radius:32,coef:0.0005});
planetProps.set("saturn",{radius:49,coef:0.0001});
planetProps.set("uranus",{radius:62,coef:0.00005});
planetProps.set("neptune",{radius:76,coef:0.00001});
planetProps.set("system",{radius:76,coef:0.00001});



let renderer = new THREE.WebGL1Renderer({antialias: true});
renderer.setSize( window.innerWidth/1.1, window.innerHeight/1.1 );
renderer.setClearColor( 0x010616, 1 );
renderer.shadowMap.enabled = true;




let light = new THREE.PointLight(0xffffff, 1);
light.position.set(0, 0, 0);
light.castShadow = true;
scene.add(light);


document.body.insertBefore( renderer.domElement,document.body.firstChild);

let boost = 1;


let camAngel = [];
for(let i = 0;i<9;++i) camAngel.push(0);

 
let data = [
    {
        name: "Меркурий",
        radius: "2439,7 ± 1,0 км",
        day: "58,65 земных суток",
        year:"88 земных суток",
        fact:" Поверхность Меркурия схожа с поверхностью Луны. Уступы могут достигать 1000 километров в диаметре. Имеется большое количество кратеров, некоторые из них достаточно высокие.",
    },
    {
        name: "Венера",
        radius: "6051,8 км",
        day: "243 земных суток",
        year:"225 земных суток",
        fact:"Облака на планете имеют в составе серную кислоту и способны растворять алмазы и цинк.",
    },{
        name: "Земля",
        radius: "6378,1 км",
        day: "1 земных суток",
        year:"365 земных суток",
        fact:"Планета населена людьми.",
    },{
        name: "Марс",
        radius: "3 389,5 км",
        day: "1 день 37 мин",
        year:"686,94 земных суток",
        fact:"На Марсе существуют горы выше Эвереста, а гора Олимп является в настоящее время самой высокой горой в Солнечной системе, известной человечеству."
    },{
        name: "Юпитер",
        radius: "71 492 ± 4 км",
        day: "10 ч.",
        year:"12 земных лет",
        fact:"Юпитep нacтoлькo мaccивeн, чтo eгo oбщaя мacca вдвoe пpeвышaeт мaccу вcex плaнeт Coлнeчнoй cиcтeмы, вмecтe взятыx. Oднaкo мacca Юпитepa cocтaвляeт вceгo 1 тыcячную чacть oбщeй мaccы Coлнцa.",
    },{
        name: "Сатурн",
        radius: "58 232 ± 6 км",
        day: "10 ч. 34 мин.",
        year:"29 земных лет",
        fact:"Дeнь Cуббoтa (пo aнгл. «Saturdaу») в нeдeлe пoлучил cвoe нaзвaниe oт этoй плaнeты.",
    },{
        name: "Уран",
        radius: "25 362 ± 7 км.",
        day: "17 ч 14 мин",
        year:"84 земных года",
        fact:"Оcь плaнeты укaзывaeт пoчти пpямo нa Coлнцe. Учeныe гoвopят, чтo этoт нeoбычный нaклoн cвязaн c тeм, чтo в бoлee paнниe дни плaнeтa cтoлкнулacь c дpугим плaнeтapным oбъeктoм.",
    },{
        name: "Нептун",
        radius: "24 622 ± 19 км",
        day: "16 ч.",
        year:"165 земных года",
        fact:"Температура достигает -221ºС. Такую температуру не сможет вынести ни одно живое существо.",
    }
];

let dataMap = new Map();

dataMap.set("mercurius",data[0]);
dataMap.set("venus",data[1]);
dataMap.set("earth",data[2]);
dataMap.set("mars",data[3]);
dataMap.set("jupiter",data[4]);
dataMap.set("saturn",data[5]);
dataMap.set("uranus",data[6]);
dataMap.set("neptune",data[7]);

function fill(obj){
    document.getElementById("name").innerHTML = obj.name;
    document.getElementById("radius").innerHTML = obj.radius;
    document.getElementById("day").innerHTML = obj.day;
    document.getElementById("year").innerHTML = obj.year;
    document.getElementById("fact").innerHTML = obj.fact;
}