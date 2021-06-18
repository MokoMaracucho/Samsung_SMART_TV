import './style.css';

import * as dat from 'dat.gui';

import  * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { gsap } from 'gsap';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// GUI

const gui = new dat.GUI();

// SCENE

const scene = new THREE.Scene();

// CANVAS

const canvas = document.querySelector('canvas.webgl');

// SIZES

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// CAMERA TARGET

const hauteurTarget = 3;

const cameraTarget_GEOMETRY = new THREE.BoxGeometry( 1, 1, 1 );
const cameraTarget_MATERIAL = new THREE.MeshBasicMaterial( {color: 0xff0000} );
const cameraTarget_MESH = new THREE.Mesh(cameraTarget_GEOMETRY, cameraTarget_MATERIAL);
cameraTarget_MESH.position.y = hauteurTarget;
cameraTarget_MESH.visible = false;

scene.add(cameraTarget_MESH);

// CAMERA

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 10;
camera.position.z = 20;

scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.target.y = hauteurTarget;
//controls.minDistance = ;
//controls.maxDistance = ;
controls.update();

// RENDERER

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// LIGHT

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

scene.add(ambientLight);

// EVENTS

let televisionGroup_ROTATION_Y = 0.005;

const canvas_html = document.querySelector('.webgl');

canvas_html.addEventListener('pointerdown', e => {
    televisionGroup_ROTATION_Y = 0;
});

canvas.addEventListener('pointerup', e => {
    televisionGroup_ROTATION_Y = 0.005;
});

// OVERLAY

const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms:
    {
        uAlpha: {value: 1}
    },
    vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlpha;
        void main()
        {
            gl_FragColor = vec4(0.82, 0.82, 0.82, uAlpha);
        }
    `
});
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);

// LOADING MANAGER

const loadingBarElement = document.querySelector('.loading-bar');

const loadingManager = new THREE.LoadingManager(
    () => {
        gsap.delayedCall(0.5, () => {
            console.log("DONE");
            gsap.to(overlayMaterial.uniforms.uAlpha, {duration: 3, value: 0});
            loadingBarElement.classList.add('ended');
            loadingBarElement.style.transform = '';

            gsap.delayedCall(0.5, () => {
                loadSecondMesh();

                gsap.delayedCall(0.5, () => {
                    loadThirdMesh();

                    gsap.delayedCall(0.5, () => {
                        loadFourthMesh();
                    });
                });
            });
            
        });
    },
    (itemUrl, itemsLoaded, itemsTotal) => {
        console.log(itemUrl);
        const progressRatio = itemsLoaded / itemsTotal;
        loadingBarElement.style.transform = 'scaleX(' + progressRatio + ')';
    }
);

// ENV

const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

const environnementMapTexture = cubeTextureLoader.load([
    '/img/textures/cubeMaps/px.png',
    '/img/textures/cubeMaps/nx.png',
    '/img/textures/cubeMaps/py.png',
    '/img/textures/cubeMaps/ny.png',
    '/img/textures/cubeMaps/pz.png',
    '/img/textures/cubeMaps/nz.png'
]);

// TEXTURES

const textureLoader = new THREE.TextureLoader(loadingManager);

// 1 = Key_power

const Key_power_MAP = textureLoader.load('/img/textures/Key_power.jpg');

// 2 = Panel_front_1

const Panel_front_1_ALPHA_MAP = textureLoader.load('/img/textures/Panel_Opasity_mask.jpg');

// 4 = Metall_strip

const Remote_Steel_ward_MAP = textureLoader.load('/img/textures/substance/Samsung_SMART_TV_Remote_Steel_ward_BaseColor.png');
const Remote_Steel_ward_METALNESS_MAP = textureLoader.load('/img/textures/substance/Samsung_SMART_TV_Remote_Steel_ward_Metallic.png');
const Remote_Steel_ward_NORMAL_MAP = textureLoader.load('/img/textures/substance/Samsung_SMART_TV_Remote_Steel_ward_Normal.png');
const Remote_Steel_ward_ROUGHNESS_MAP = textureLoader.load('/img/textures/substance/Samsung_SMART_TV_Remote_Steel_ward_Roughness.png');

// 5 = Phone_opas

const Phone_opas_COLOR_TEXTURE = textureLoader.load('/img/textures/Phone_opas_COLOR_TEXTURE.png');

// 7 = Panel_back

const Panel_back_MAP = textureLoader.load('/img/textures/Panel_back_COLOR_TEXTURE.jpg');

// 9 = Remote_screen

const Remote_screen_MAP = textureLoader.load('/img/textures/Remote_screen_1.jpg');

// 11 = Back_label

const Back_label_COLOR_TEXTURE = textureLoader.load('/img/textures/Back_label_COLOR_TEXTURE.jpg');

// 14 = Metall_strip

const Metall_strip_MAP = textureLoader.load('/img/textures/substance/Samsung_SMART_TV_Metall_strip_BaseColor.png');
const Metall_strip_METALNESS_MAP = textureLoader.load('/img/textures/substance/Samsung_SMART_TV_Metall_strip_Metallic.png');
const Metall_strip_NORMAL_MAP = textureLoader.load('/img/textures/substance/Samsung_SMART_TV_Metall_strip_Normal.png');
const Metall_strip_ROUGHNESS_MAP = textureLoader.load('/img/textures/substance/Samsung_SMART_TV_Metall_strip_Roughness.png');

//  GROUND

const ground_ALPHA_TEXTURE = textureLoader.load('/img/textures/Shadow_ALPHA_MAP.jpg');

// LOADER

const loader = new GLTFLoader();

const television_GROUP = new THREE.Group();
scene.add(television_GROUP);
/* const phone_GROUP = new THREE.Group();
const camera_GROUP = new THREE.Group();
const headphone_GROUP = new THREE.Group(); */

let television_MESH = new THREE.Object3D;
let phone_MESH = new THREE.Object3D;
let camera_MESH = new THREE.Object3D;
let headphone_MESH = new THREE.Object3D;

loader.load(
	'gltf/Samsung_SMART_TV.gltf',
	function (gltf) {
		scene.add(gltf.scene);
        television_MESH = gltf.scene;
        //television_MESH.parent(television_GROUP);
		gltf.asset;
        gltf.scene.traverse(function(child) {
            //console.log(child);
            //television_MESH.push(child);
        });
        television_GROUP.add(television_MESH);

        // 1 = Key_power

        let Key_power_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_1");

        const Key_power_MATERIAL = new THREE.MeshStandardMaterial();
        Key_power_MATERIAL.map = Key_power_MAP;

        Key_power_MATERIAL.envMap = environnementMapTexture;

        Key_power_MESH.material = Key_power_MATERIAL;

        // 2 = Panel_front_1

        let Panel_front_1_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_2");

        const Panel_front_1_MATERIAL = new THREE.MeshStandardMaterial();
        Panel_front_1_MATERIAL.color = new THREE.Color( 0x000000 );
        Panel_front_1_MATERIAL.metalness = 0;
        Panel_front_1_MATERIAL.roughness = 0;
        Panel_front_1_MATERIAL.clearcoat = 10;
        Panel_front_1_MATERIAL.transparent = true;
        Panel_front_1_MATERIAL.alphaMap = Panel_front_1_ALPHA_MAP;

        Panel_front_1_MATERIAL.envMap = environnementMapTexture;
        
        Panel_front_1_MESH.material = Panel_front_1_MATERIAL;

        // 3 = Panel_front_2

        let Panel_front_2_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_3");
        const Panel_front_2_MATERIAL = new THREE.MeshStandardMaterial();
        Panel_front_2_MATERIAL.color = new THREE.Color( 0x000000 );
        Panel_front_2_MATERIAL.metalness = 0.4;
        Panel_front_2_MATERIAL.roughness = 0;
        Panel_front_2_MATERIAL.envMap = environnementMapTexture;
        
        Panel_front_2_MESH.material = Panel_front_2_MATERIAL;

        // 4 = Remote_Steel_ward

        let Remote_Steel_ward_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_4");
        const Remote_Steel_ward_MATERIAL = new THREE.MeshStandardMaterial();
        Remote_Steel_ward_MATERIAL.color = new THREE.Color( 0x808080 );
        Remote_Steel_ward_MATERIAL.metalness = 0.8;
        Remote_Steel_ward_MATERIAL.roughness = 0.2;

        Remote_Steel_ward_MATERIAL.map = Remote_Steel_ward_MAP;
        Remote_Steel_ward_MATERIAL.metalnessMap = Remote_Steel_ward_METALNESS_MAP;
        Remote_Steel_ward_MATERIAL.normalMap = Remote_Steel_ward_NORMAL_MAP;
        Remote_Steel_ward_MATERIAL.roughnessMap = Remote_Steel_ward_ROUGHNESS_MAP;
        
        Remote_Steel_ward_MATERIAL.envMap = environnementMapTexture;
        
        Remote_Steel_ward_MESH.material = Remote_Steel_ward_MATERIAL;

        // 5 = Phone_opas

        let Phone_opas_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_5");

        const Phone_opas_MATERIAL = new THREE.MeshStandardMaterial();
        Phone_opas_MATERIAL.map = Phone_opas_COLOR_TEXTURE;

        Phone_opas_MATERIAL.envMap = environnementMapTexture;
        
        Phone_opas_MESH.material = Phone_opas_MATERIAL;

        // 6 = Plastik_glanek

        let Plastik_glanek_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_6");

        const Plastik_glanek_MATERIAL = new THREE.MeshStandardMaterial();
        Plastik_glanek_MATERIAL.color = new THREE.Color( 0x303030 );
        Plastik_glanek_MATERIAL.metalness = 0.4;
        Plastik_glanek_MATERIAL.roughness = 0.4;

        Plastik_glanek_MATERIAL.envMap = environnementMapTexture;
        
        Plastik_glanek_MESH.material = Plastik_glanek_MATERIAL;

        // 7 = Panel_back

        let Panel_back_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_7");

        const Panel_back_MATERIAL = new THREE.MeshStandardMaterial();
        Panel_back_MATERIAL.map = Panel_back_MAP;

        Panel_back_MATERIAL.envMap = environnementMapTexture;
        
        Panel_back_MESH.material = Plastik_glanek_MATERIAL;

        // 8 = Chrom_kant

        let Chrom_kant_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_8");
        
        const Chrom_kant_MATERIAL = new THREE.MeshStandardMaterial();
        Chrom_kant_MATERIAL.color = new THREE.Color( 0xFFFFFF );
        Chrom_kant_MATERIAL.metalness = 0.7;
        Chrom_kant_MATERIAL.roughness = 0.2;

        Chrom_kant_MATERIAL.envMap = environnementMapTexture;
            
        Chrom_kant_MESH.material = Chrom_kant_MATERIAL;

        // 9 = Remote_screen

        let Remote_screen_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_9");

        const Remote_screen_MATERIAL = new THREE.MeshStandardMaterial();
        Remote_screen_MATERIAL.color = new THREE.Color( 0xFFFFFF );
        Remote_screen_MATERIAL.emissive = new THREE.Color( 0xFFFFFF );
        Remote_screen_MATERIAL.emissiveIntensity = 0.1;
        Remote_screen_MATERIAL.map = Remote_screen_MAP;

        Remote_screen_MATERIAL.envMap = environnementMapTexture;
        
        Remote_screen_MESH.material = Remote_screen_MATERIAL;

        // 10 = Chrom_rem

        let Chrom_rem_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_10");

        const Chrom_rem_MATERIAL = new THREE.MeshStandardMaterial();
        Chrom_rem_MATERIAL.color = new THREE.Color(0xFFFFFF);
        Chrom_rem_MATERIAL.metalness = 1;
        Chrom_rem_MATERIAL.roughness = 0.05;

        Chrom_rem_MATERIAL.envMap = environnementMapTexture;
        
        Chrom_rem_MESH.material = Chrom_rem_MATERIAL;

        // 11 = Back_label

        let Back_label_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_11");

        const Back_label_MATERIAL = new THREE.MeshStandardMaterial();
        Back_label_MATERIAL.map = Back_label_COLOR_TEXTURE;

        Back_label_MATERIAL.envMap = environnementMapTexture;
        
        Back_label_MESH.material = Back_label_MATERIAL;

        // 12 = Screen_off

        let video = document.createElement('video');
        video.src = "videos/SmallWorld_Samsung.mp4";
        video.muted = true;
        video.load();
        video.play();
        video.loop = true;

        let texture = new THREE.VideoTexture(video);

        let Screen_off_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_12");
        Screen_off_MESH.scale.z = -1;
        Screen_off_MESH.position.z = -7.415;

        let Screen_off_MATERIAL = new THREE.MeshPhysicalMaterial();
        Screen_off_MATERIAL.map = texture;
        Screen_off_MATERIAL.metalness = 0.5;
        Screen_off_MATERIAL.roughness = 0.7;
        Screen_off_MATERIAL.emissive = new THREE.Color(0xAAAAAA);
        Screen_off_MATERIAL.emissiveMap = texture;
        Screen_off_MATERIAL.emissiveIntensity = 0.8;
        Screen_off_MATERIAL.clearcoat = 1;
        Screen_off_MATERIAL.clearcoatRoughness = 1;
        Screen_off_MATERIAL.envMap = environnementMapTexture;
        
        Screen_off_MESH.material = Screen_off_MATERIAL;

        // 13 = Chrom

        let Chrom_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_13");

        Chrom_MESH.geometry.setAttribute('uv2', new THREE.BufferAttribute(Chrom_MESH.geometry.attributes.uv.array, 2))
        const Chrom_MATERIAL = new THREE.MeshStandardMaterial();
        Chrom_MATERIAL.color = new THREE.Color(0xFFFFFF);
        Chrom_MATERIAL.metalness = 0.6;
        Chrom_MATERIAL.roughness = 0;

        Chrom_MATERIAL.envMap = environnementMapTexture; 

        Chrom_MESH.material = Chrom_MATERIAL;

        // 14 = Metall_strip

        let Metall_strip_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_14");
        
        const Metall_strip_MATERIAL = new THREE.MeshStandardMaterial();

        Metall_strip_MATERIAL.map = Metall_strip_MAP;
        Metall_strip_MATERIAL.metalnessMap = Metall_strip_METALNESS_MAP;
        Metall_strip_MATERIAL.normalMap = Metall_strip_NORMAL_MAP;
        Metall_strip_MATERIAL.roughnessMap = Metall_strip_ROUGHNESS_MAP;
        Metall_strip_MATERIAL.envMap = environnementMapTexture; 

        Metall_strip_MESH.material = Metall_strip_MATERIAL;

        // 15 = Glass_black

        let Glass_black_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_15");

        const Glass_black_MATERIAL = new THREE.MeshStandardMaterial();
        Glass_black_MATERIAL.color = new THREE.Color(0xCFCFCF);
        Glass_black_MATERIAL.metalness = 0.6;
        Glass_black_MATERIAL.roughness = 0.2;

        Glass_black_MATERIAL.envMap = environnementMapTexture; 

        Glass_black_MESH.material = Glass_black_MATERIAL;

        // 16 = Metall_dark

        let Metall_dark_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_16");

        const Metall_dark_MATERIAL = new THREE.MeshStandardMaterial();
        Metall_dark_MATERIAL.color = new THREE.Color(0x4D4D4D);
        Metall_dark_MATERIAL.metalness = 0.7;
        Metall_dark_MATERIAL.roughness = 0.5;

        Metall_dark_MATERIAL.envMap = environnementMapTexture; 

        Metall_dark_MESH.material = Metall_dark_MATERIAL;

        // 17 = Gold

        let Gold_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_17");

        const Gold_MATERIAL = new THREE.MeshStandardMaterial();
        Gold_MATERIAL.color = new THREE.Color(0xFFDA00);
        Gold_MATERIAL.metalness = 1;
        Gold_MATERIAL.roughness = 0;
        
        Gold_MATERIAL.envMap = environnementMapTexture; 

        Gold_MESH.material = Gold_MATERIAL;

        // 18 = Steel

        let Steel_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_18");

        const Steel_MATERIAL = new THREE.MeshStandardMaterial();
        Steel_MATERIAL.color = new THREE.Color(0x898989);
        Steel_MATERIAL.metalness = 1;
        Steel_MATERIAL.roughness = 0;

        Steel_MATERIAL.envMap = environnementMapTexture; 

        Steel_MESH.material = Steel_MATERIAL;

        // 19 = Plastic_black

        let Plastic_black_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_19");

        const Plastic_black_MATERIAL = new THREE.MeshStandardMaterial();
        Plastic_black_MATERIAL.color = new THREE.Color(0x000000);
        Plastic_black_MATERIAL.metalness = 1;
        Plastic_black_MATERIAL.roughness = 0.3;

        Plastic_black_MATERIAL.envMap = environnementMapTexture; 

        Plastic_black_MESH.material = Plastic_black_MATERIAL;

        // 20 = Plastic_white

        let Plastic_white_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_20");

        const Plastic_white_MATERIAL = new THREE.MeshStandardMaterial();
        Plastic_white_MATERIAL.color = new THREE.Color(0xFFFFFF);
        Plastic_white_MATERIAL.metalness = 1;
        Plastic_white_MATERIAL.roughness = 0.3;

        Plastic_white_MATERIAL.envMap = environnementMapTexture; 

        Plastic_white_MESH.material = Plastic_white_MATERIAL;

        // 21 = Plastic_yellow

        let Plastic_yellow_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_21");

        const Plastic_yellow_MATERIAL = new THREE.MeshStandardMaterial();
        Plastic_yellow_MATERIAL.color = new THREE.Color( 0xFFCE00 );
        Plastic_yellow_MATERIAL.metalness = 0;
        Plastic_yellow_MATERIAL.roughness = 1;

        Plastic_yellow_MATERIAL.envMap = environnementMapTexture; 

        Plastic_yellow_MESH.material = Plastic_yellow_MATERIAL;
        
        // 22 = Luminium

        let Luminium_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_22");

        const Luminium_MATERIAL = new THREE.MeshStandardMaterial();
        Luminium_MATERIAL.color = new THREE.Color(0xC8C8C8);
        Luminium_MATERIAL.metalness = 1;
        Luminium_MATERIAL.roughness = 0.5;

        Luminium_MATERIAL.envMap = environnementMapTexture; 

        Luminium_MESH.material = Luminium_MATERIAL;

        // 23 = Plastic_black_gloss

        let Plastic_black_gloss_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_23");

        const Plastic_black_gloss_MATERIAL = new THREE.MeshStandardMaterial();
        Plastic_black_gloss_MATERIAL.color = new THREE.Color(0x000000);
        Plastic_black_gloss_MATERIAL.metalness = 1;
        Plastic_black_gloss_MATERIAL.roughness = 0.05;

        Plastic_black_gloss_MATERIAL.envMap = environnementMapTexture; 

        Plastic_black_gloss_MESH.material = Plastic_black_gloss_MATERIAL;
	},
    
	function (xhr) {
		console.log((xhr.loaded / xhr.total * 100) + '% loaded');
	},
    
	function ( error ) {
		console.log('An error happened');
	}
);

// GROUND

const ground_GEOMETRY = new THREE.PlaneGeometry(20, 20);
const ground_MATERIAL = new THREE.MeshBasicMaterial( {color: 0x000000, transparent: false, alphaMap: ground_ALPHA_TEXTURE} );
const television_GROUND = new THREE.Mesh(ground_GEOMETRY, ground_MATERIAL);
television_GROUND.rotation.x = - Math.PI / 2;

television_GROUP.add(television_GROUND);
if("undefined" !== typeof television_GROUP.activeItem) {
    television_GROUP.activeItem = true;
}

// ANIMATE

const animate = function () {
    requestAnimationFrame( animate );

    television_GROUP.rotation.y += televisionGroup_ROTATION_Y;

    console.log(camera.rotation.y)

    camera.lookAt(cameraTarget_MESH.position.x, cameraTarget_MESH.position.y, cameraTarget_MESH.position.z);

    renderer.render(scene, camera);
    renderer.setClearColor(0xD2D2D2, 1);
};

// RESIZE

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

animate();

// LOADER SECONBD MESH

const loadSecondMesh = function () {
    console.log("Start load 2");

    loader.load(
        'gltf/iPhone_12_pro_obj.gltf',
        function (gltf) {
            scene.add(gltf.scene);
            phone_MESH = gltf.scene;
            phone_MESH.position.x = 20;
            phone_MESH.visible = false;
            if("undefined" !== typeof phone_MESH.activeItem) {
                phone_MESH.activeItem = false;
            }
            gltf.asset;
            gltf.scene.traverse(function(child) {
                console.log(child);
            });
        },
        
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        
        function ( error ) {
            console.log('An error happened');
        }
    );
}

// LOADER THIRD MESH

const loadThirdMesh = function () {
    console.log("Start load 3");

    loader.load(
        'gltf/Canon_G9_II_Black.gltf',
        function (gltf) {
            scene.add(gltf.scene);
            camera_MESH = gltf.scene;
            camera_MESH.position.x = 10;
            camera_MESH.visible = false;
            if("undefined" !== typeof camera_MESH.activeItem) {
                camera_MESH.activeItem = false;
            }
            gltf.asset;
            gltf.scene.traverse(function(child) {
                console.log(child);
            });
        },
        
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        
        function ( error ) {
            console.log('An error happened');
        }
    );
}

// LOADER THIRD MESH

const loadFourthMesh = function () {
    console.log("Start load 4");

    loader.load(
        'gltf/Beats_Studio_3.gltf',
        function (gltf) {
            scene.add(gltf.scene);
            headphone_MESH = gltf.scene;
            headphone_MESH.position.y = 10;
            headphone_MESH.visible = false;
            if("undefined" !== typeof headphone_MESH.activeItem) {
                headphone_MESH.activeItem = false;
            }
            gltf.asset;
            gltf.scene.traverse(function(child) {
                console.log(child);
            });
        },
        
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        
        function ( error ) {
            console.log('An error happened');
        }
    );
}

// EVENTS II

const span_category_televisions_ELEMENT = document.querySelector('#span_category_televisions');

span_category_televisions.addEventListener('click', () => {
    //setActiveItem();
    television_GROUP.visible = true;
    television_GROUP.activeItem = true;
    phone_MESH.visible = false;
    phone_MESH.activeItem = false;
    camera_MESH.visible = false;
    camera_MESH.activeItem = false;
    headphone_MESH.visible = false;
    headphone_MESH.activeItem = false;

});

const span_category_phones_ELEMENT = document.querySelector('#span_category_phones');

span_category_phones.addEventListener('click', () => {
    //setActiveItem();
    television_GROUP.visible = false;
    television_GROUP.activeItem = false;
    phone_MESH.visible = true;
    phone_MESH.activeItem = true;
    camera_MESH.visible = false;
    camera_MESH.activeItem = false;
    headphone_MESH.visible = false;
    headphone_MESH.activeItem = false;

    /* if(television_GROUP.activeItem = true) {
        television_GROUP.activeItem = false;
        //television_GROUP.visible  = false;
        gsap.to(television_GROUP.position, {duration: 5, delay: 0, x: -10});
    } */
    gsap.to(controls.target, {duration: 2, x: 20});
    gsap.to(cameraTarget_MESH.position, {duration: 2, x: 20});
    gsap.to(camera.position, {duration: 2, x: 20});
    gsap.to(camera.position, {duration: 2, y: 10});
    gsap.to(camera.position, {duration: 2, z: 20});
    
    gsap.delayedCall(2, () => {
        television_GROUP.visible = false;
    });

});

const span_category_cameras_ELEMENT = document.querySelector('#span_category_cameras');

const span_category_cameras = document.querySelector('#span_category_cameras');
span_category_cameras.addEventListener('click', () => {
    //setActiveItem();
    television_GROUP.visible = false;
    television_GROUP.activeItem = false;
    phone_MESH.visible = false;
    phone_MESH.activeItem = false;
    camera_MESH.visible = true;
    camera_MESH.activeItem = true;
    headphone_MESH.visible = false;
    headphone_MESH.activeItem = false;

});

const span_category_headphones_ELEMENT = document.querySelector('#span_category_headphones');

const span_category_headphones = document.querySelector('#span_category_headphones');
span_category_headphones.addEventListener('click', () => {
    //setActiveItem();
    television_GROUP.visible = false;
    television_GROUP.activeItem = false;
    phone_MESH.visible = false;
    phone_MESH.activeItem = false;
    camera_MESH.visible = false;
    camera_MESH.activeItem = false;
    headphone_MESH.visible = true;
    headphone_MESH.activeItem = true;

});

const setActiveItem = function() {
    if (television_GROUP.activeItem = true) {
        television_GROUP.activeItem = false;
        television_GROUP.visible  = false;
    } else if (phone_MESH.activeItem = true) {
        phone_MESH.activeItem = false;
        phone_MESH.visible  = false;
    } else if (camera_MESH.activeItem = true) {
        camera_MESH.activeItem = false;
        camera_MESH.visible  = false;
    } else {
        headphone_MESH.activeItem = false;
        headphone_MESH.visible  = false;
    }
}

  