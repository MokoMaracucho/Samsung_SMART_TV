import './style.css';

import  * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'dat.gui';
import { gsap } from 'gsap';

// GUI

const gui = new dat.GUI();

// SCENE

const scene = new THREE.Scene();

// CANVAS

const canvas = document.querySelector('canvas.webgl');

// SIZES

const sizes = {
    width: (window.innerWidth / 100) * 70,
    height: window.innerHeight
}

// CAMERA

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 10;
camera.position.y = 10;
camera.position.z = 20;

scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.target.y = 2;
controls.update();

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

scene.add(pointLight, ambientLight);

// OVERLAY

const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms:
    {
        uAlpha: {value: 0.5}
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
            gsap.to(overlayMaterial.uniforms.uAlpha, {duration: 3, value: 0});
            loadingBarElement.classList.add('ended');
            loadingBarElement.style.transform = '';
        });
    },
    (itemUrl, itemsLoaded, itemsTotal) => {
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

const Remote_Steel_ward_AO_TEXTURE = textureLoader.load('/img/textures/Remote_Steel_ward_AO_TEXTURE.png');
const Remote_Steel_ward_NORMAL_TEXTURE = textureLoader.load('/img/textures/Remote_Steel_ward_NORMAL_TEXTURE.png');

const Phone_opas_COLOR_TEXTURE = textureLoader.load('/img/textures/Phone_opas_COLOR_TEXTURE.png');

const Panel_back_COLOR_TEXTURE = textureLoader.load('/img/textures/Panel_back_COLOR_TEXTURE.png');

const Back_label_COLOR_TEXTURE = textureLoader.load('/img/textures/Back_label_COLOR_TEXTURE.jpg');

const Screen_off_COLOR_TEXTURE = textureLoader.load('/img/textures/Screen_off_COLOR_TEXTURE.png');



const Chrom_AO_TEXTURE = textureLoader.load('/img/textures/Chrom_AO_TEXTURE.png');

// 1 = Key_power

const Key_power_MAP = textureLoader.load('/img/textures/Key_power.jpg');

// 2 = Panel_front_1

const Panel_front_1_ALPHA_MAP = textureLoader.load('/img/textures/Panel_Opasity_mask.jpg');

// 4 = Metall_strip

const Remote_Steel_ward_MAP = textureLoader.load('/img/textures/substance/Samsung_SMART_TV_Remote_Steel_ward_BaseColor.png');
const Remote_Steel_ward_METALNESS_MAP = textureLoader.load('/img/textures/substance/Samsung_SMART_TV_Remote_Steel_ward_Metallic.png');
const Remote_Steel_ward_NORMAL_MAP = textureLoader.load('/img/textures/substance/Samsung_SMART_TV_Remote_Steel_ward_Normal.png');
const Remote_Steel_ward_ROUGHNESS_MAP = textureLoader.load('/img/textures/substance/Samsung_SMART_TV_Remote_Steel_ward_Roughness.png');

// 7 = Panel_back

const Panel_back_MAP = textureLoader.load('/img/textures/Panel_back_COLOR_TEXTURE.jpg');

// 9 = Remote_screen

const Remote_screen_MAP = textureLoader.load('/img/textures/Remote_screen_1.jpg');

// 14 = Metall_strip

const Metall_strip_MAP = textureLoader.load('/img/textures/substance/Samsung_SMART_TV_Metall_strip_BaseColor.png');
const Metall_strip_METALNESS_MAP = textureLoader.load('/img/textures/substance/Samsung_SMART_TV_Metall_strip_Metallic.png');
const Metall_strip_NORMAL_MAP = textureLoader.load('/img/textures/substance/Samsung_SMART_TV_Metall_strip_Normal.png');
const Metall_strip_ROUGHNESS_MAP = textureLoader.load('/img/textures/substance/Samsung_SMART_TV_Metall_strip_Roughness.png');

//  GROUND

const ground_ALPHA_TEXTURE = textureLoader.load('/img/textures/Shadow_ALPHA_MAP.jpg');

// LOADER

const loader = new GLTFLoader();
let loadedMesh = new THREE.Object3D;

loader.load(
	'gltf/Samsung_SMART_TV.gltf',
	function (gltf) {
		scene.add(gltf.scene);
        loadedMesh = gltf.scene;
		gltf.asset;
        gltf.scene.traverse(function(child) {
            console.log(child);
        });

        var colors = {
            Key_power_COLOR: "#000000",
            Panel_front_1_COLOR: "#000000",
            Panel_front_2_COLOR: "#000000",
            Plastik_glanek_COLOR: "#000000",
            Chrom_kant_COLOR: "#000000",
            Chrom_rem_COLOR: "#000000",
            Chrom_COLOR: "#000000",
            Metall_strip_COLOR: "#000000",
            Glass_black_COLOR: "#000000",
            Metall_dark_COLOR: "#000000",
            Plastic_black_COLOR: "#000000",
            Plastic_black_gloss_COLOR: "#000000",
            Gold_COLOR: "#000000",
            Steel_COLOR: "#000000",
            Plastic_white_COLOR: "#000000",
            Plastic_yellow_COLOR: "#000000",
            Luminium_COLOR: "#000000"
          };

        // 1 = Key_power

            var Key_power_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_1");
            const Key_power_MATERIAL = new THREE.MeshStandardMaterial();
            Key_power_MATERIAL.map = Key_power_MAP;
            Key_power_MATERIAL.envMap = environnementMapTexture;
            Key_power_MESH.material = Key_power_MATERIAL;

        // 2 = Panel_front_1

            var Panel_front_1_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_2");
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

            var Panel_front_2_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_3");
            const Panel_front_2_MATERIAL = new THREE.MeshStandardMaterial();
            Panel_front_2_MATERIAL.color = new THREE.Color( 0x000000 );
            Panel_front_2_MATERIAL.metalness = 0.4;
            Panel_front_2_MATERIAL.roughness = 0;
            Panel_front_2_MATERIAL.envMap = environnementMapTexture;
            
            Panel_front_2_MESH.material = Panel_front_2_MATERIAL;

        // 4 = Remote_Steel_ward

            var Remote_Steel_ward_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_4");
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

            var Phone_opas_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_5");
            const Phone_opas_MATERIAL = new THREE.MeshStandardMaterial();
            Phone_opas_MATERIAL.map = Phone_opas_COLOR_TEXTURE;
            Phone_opas_MATERIAL.envMap = environnementMapTexture;
            
            Phone_opas_MESH.material = Phone_opas_MATERIAL;

        // 6 = Plastik_glanek

            var Plastik_glanek_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_6");
            const Plastik_glanek_MATERIAL = new THREE.MeshStandardMaterial();
            Plastik_glanek_MATERIAL.color = new THREE.Color( 0x303030 );
            Plastik_glanek_MATERIAL.metalness = 0.4;
            Plastik_glanek_MATERIAL.roughness = 0.4;
            Plastik_glanek_MATERIAL.envMap = environnementMapTexture;
            
            Plastik_glanek_MESH.material = Plastik_glanek_MATERIAL;

        // 7 = Panel_back

            var Panel_back_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_7");
            const Panel_back_MATERIAL = new THREE.MeshStandardMaterial();
            Panel_back_MATERIAL.map = Panel_back_MAP;
            Panel_back_MATERIAL.envMap = environnementMapTexture;
            
            Plastik_glanek_MESH.material = Plastik_glanek_MATERIAL;

        // 8 = Chrom_kant

            var Chrom_kant_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_8");
            const Chrom_kant_MATERIAL = new THREE.MeshStandardMaterial();
            Chrom_kant_MATERIAL.color = new THREE.Color( 0xFFFFFF );
            Chrom_kant_MATERIAL.metalness = 0.7;
            Chrom_kant_MATERIAL.roughness = 0.2;
            Chrom_kant_MATERIAL.envMap = environnementMapTexture;
            
            Chrom_kant_MESH.material = Chrom_kant_MATERIAL;

        // 9 = Remote_screen

            var Remote_screen_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_9");
            const Remote_screen_MATERIAL = new THREE.MeshStandardMaterial();
            Remote_screen_MATERIAL.color = new THREE.Color( 0xFFFFFF );
            Remote_screen_MATERIAL.emissive = new THREE.Color( 0xFFFFFF );
            Remote_screen_MATERIAL.emissiveIntensity = 0.1;
            Remote_screen_MATERIAL.map = Remote_screen_MAP;
            Remote_screen_MATERIAL.envMap = environnementMapTexture;
            
            Remote_screen_MESH.material = Remote_screen_MATERIAL;

        // 10 = Chrom_rem

            var Chrom_rem_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_10");
            const Chrom_rem_MATERIAL = new THREE.MeshStandardMaterial();
            Chrom_rem_MATERIAL.color = new THREE.Color( 0xFFFFFF );
            Chrom_rem_MATERIAL.metalness = 1;
            Chrom_rem_MATERIAL.roughness = 0.05;
            Chrom_rem_MATERIAL.envMap = environnementMapTexture;
            
            Chrom_rem_MESH.material = Chrom_rem_MATERIAL;

        // 11 = Back_label

            var Back_label_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_11");
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
            var texture = new THREE.VideoTexture(video);

            let Screen_off_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_12");
            Screen_off_MESH.scale.z = -1;
            Screen_off_MESH.position.z = -7.415;
            let Screen_off_MATERIAL = new THREE.MeshPhysicalMaterial();
            Screen_off_MATERIAL.map = texture;

            Screen_off_MATERIAL.metalness = 0.5;
            Screen_off_MATERIAL.roughness = 0.7;
            Screen_off_MATERIAL.emissive = new THREE.Color(0xFFFFFF);
            Screen_off_MATERIAL.emissiveIntensity = 0.15;
            Screen_off_MATERIAL.clearcoat = 1;
            Screen_off_MATERIAL.clearcoatRoughness = 1;
            Screen_off_MATERIAL.envMap = environnementMapTexture;
            
            Screen_off_MESH.material = Screen_off_MATERIAL;

        // 13 = Chrom

            var Chrom_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_13");
            Chrom_MESH.geometry.setAttribute('uv2', new THREE.BufferAttribute(Chrom_MESH.geometry.attributes.uv.array, 2))
            const Chrom_MATERIAL = new THREE.MeshStandardMaterial();
            Chrom_MATERIAL.color = new THREE.Color( 0xFFFFFF );
            Chrom_MATERIAL.metalness = 0.6;
            Chrom_MATERIAL.roughness = 0;
            Chrom_MATERIAL.envMap = environnementMapTexture; 

            Chrom_MESH.material = Chrom_MATERIAL;

        // 14 = Metall_strip

            var Metall_strip_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_14");
            const Metall_strip_MATERIAL = new THREE.MeshStandardMaterial();

            Metall_strip_MATERIAL.map = Metall_strip_MAP;
            Metall_strip_MATERIAL.metalnessMap = Metall_strip_METALNESS_MAP;
            Metall_strip_MATERIAL.normalMap = Metall_strip_NORMAL_MAP;
            Metall_strip_MATERIAL.roughnessMap = Metall_strip_ROUGHNESS_MAP;
            Metall_strip_MATERIAL.envMap = environnementMapTexture; 

            Metall_strip_MESH.material = Metall_strip_MATERIAL;

        // 15 = Glass_black

            var Glass_black_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_15");
            const Glass_black_MATERIAL = new THREE.MeshStandardMaterial();
            Glass_black_MATERIAL.color = new THREE.Color( 0xCFCFCF );
            Glass_black_MATERIAL.metalness = 0.6;
            Glass_black_MATERIAL.roughness = 0.2;
            Glass_black_MATERIAL.envMap = environnementMapTexture; 

            Glass_black_MESH.material = Glass_black_MATERIAL;

        // 16 = Metall_dark

            var Metall_dark_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_16");
            const Metall_dark_MATERIAL = new THREE.MeshStandardMaterial();
            Metall_dark_MATERIAL.color = new THREE.Color( 0x4D4D4D );
            Metall_dark_MATERIAL.metalness = 0.7;
            Metall_dark_MATERIAL.roughness = 0.5;
            Metall_dark_MATERIAL.envMap = environnementMapTexture; 

            Metall_dark_MESH.material = Metall_dark_MATERIAL;

        // 17 = Gold

            var Gold_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_17");
            const Gold_MATERIAL = new THREE.MeshStandardMaterial();
            Gold_MATERIAL.color = new THREE.Color( 0xFFDA00 );
            Gold_MATERIAL.metalness = 1;
            Gold_MATERIAL.roughness = 0;
            Gold_MATERIAL.envMap = environnementMapTexture; 

            Gold_MESH.material = Gold_MATERIAL;

        // 18 = Steel

            var Steel_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_18");
            const Steel_MATERIAL = new THREE.MeshStandardMaterial();
            Steel_MATERIAL.color = new THREE.Color( 0x898989 );
            Steel_MATERIAL.metalness = 1;
            Steel_MATERIAL.roughness = 0;
            Steel_MATERIAL.envMap = environnementMapTexture; 

            Steel_MESH.material = Steel_MATERIAL;

        // 19 = Plastic_black

            var Plastic_black_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_19");
            const Plastic_black_MATERIAL = new THREE.MeshStandardMaterial();
            Plastic_black_MATERIAL.color = new THREE.Color( 0x000000 );
            Plastic_black_MATERIAL.metalness = 1;
            Plastic_black_MATERIAL.roughness = 0.3;
            Plastic_black_MATERIAL.envMap = environnementMapTexture; 

            Plastic_black_MESH.material = Plastic_black_MATERIAL;

        // 20 = Plastic_white

            var Plastic_white_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_20");
            const Plastic_white_MATERIAL = new THREE.MeshStandardMaterial();
            Plastic_white_MATERIAL.color = new THREE.Color( 0xFFFFFF );
            Plastic_white_MATERIAL.metalness = 1;
            Plastic_white_MATERIAL.roughness = 0.3;
            Plastic_white_MATERIAL.envMap = environnementMapTexture; 

            Plastic_white_MESH.material = Plastic_white_MATERIAL;

        // 21 = Plastic_yellow

            var Plastic_yellow_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_21");
            const Plastic_yellow_MATERIAL = new THREE.MeshStandardMaterial();
            Plastic_yellow_MATERIAL.color = new THREE.Color( 0xFFCE00 );
            Plastic_yellow_MATERIAL.metalness = 0;
            Plastic_yellow_MATERIAL.roughness = 1;
            Plastic_yellow_MATERIAL.envMap = environnementMapTexture; 

            Plastic_yellow_MESH.material = Plastic_yellow_MATERIAL;
        
        // 22 = Luminium

            var Luminium_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_22");
            const Luminium_MATERIAL = new THREE.MeshStandardMaterial();
            Luminium_MATERIAL.color = new THREE.Color( 0xC8C8C8 );
            Luminium_MATERIAL.metalness = 1;
            Luminium_MATERIAL.roughness = 0.5;
            Luminium_MATERIAL.envMap = environnementMapTexture; 

            Luminium_MESH.material = Luminium_MATERIAL;

        // 23 = Plastic_black_gloss

            var Plastic_black_gloss_MESH = gltf.scene.getObjectByName("Samsung_SMART_TV_23");
            const Plastic_black_gloss_MATERIAL = new THREE.MeshStandardMaterial();
            Plastic_black_gloss_MATERIAL.color = new THREE.Color( 0x000000 );
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

const ground_GEOMETRY = new THREE.PlaneGeometry(20, 20);
const ground_MATERIAL = new THREE.MeshBasicMaterial( {color: 0x000000, transparent: true, alphaMap: ground_ALPHA_TEXTURE} );
const ground = new THREE.Mesh(ground_GEOMETRY, ground_MATERIAL);
ground.rotation.x = - Math.PI / 2;
scene.add(ground);

// ANIMATE

const animate = function () {
    requestAnimationFrame( animate );

    loadedMesh.rotation.y += 0.005;
    ground.rotation.z += 0.005;

    renderer.render(scene, camera);
    renderer.setClearColor(0xD2D2D2, 1);
};

animate();

// RESIZE

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});