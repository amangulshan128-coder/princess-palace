
import {
    FaceLandmarker,
    FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

// ------------------------------
// 1. BASIC 3D SCENE
// ------------------------------

const container = document.getElementById('palaceCanvas');

const scene = new THREE.Scene();

scene.background = new THREE.Color('#b97885');
scene.fog = new THREE.Fog('#b97885', 15, 45);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(0, 5, 15);
camera.lookAt(0, 2, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

container.appendChild(renderer.domElement);

// ------------------------------
// 2. LIGHTING
// ------------------------------

const ambientLight = new THREE.AmbientLight('#ffffff', 2);
scene.add(ambientLight);

const sunlight = new THREE.DirectionalLight('#ffe1ae', 3);
sunlight.position.set(-5, 10, 8);
sunlight.castShadow = true;
scene.add(sunlight);

// ------------------------------
// 3. MATERIALS
// ------------------------------

const wallMaterial = new THREE.MeshStandardMaterial({
    color: '#f0d3d2',
    roughness: 0.8
});

const roofMaterial = new THREE.MeshStandardMaterial({
    color: '#56304f',
    roughness: 0.7
});

const goldMaterial = new THREE.MeshStandardMaterial({
    color: '#d7ad59',
    metalness: 0.65,
    roughness: 0.3
});

const doorMaterial = new THREE.MeshStandardMaterial({
    color: '#59334d',
    roughness: 0.6
});

// ------------------------------
// 4. GROUND
// ------------------------------

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({
        color: '#563d52',
        roughness: 1
    })
);

ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.1;
ground.receiveShadow = true;
scene.add(ground);

// ------------------------------
// 5. PALACE MAIN BUILDING
// ------------------------------

const palace = new THREE.Group();
scene.add(palace);

function addBox(parent, width, height, depth, material, x, y, z) {

    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        material
    );

    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    parent.add(mesh);

    return mesh;
}

// Main palace structure
addBox(
    palace, 5, 4, 2.5,
    wallMaterial, 0, 2, 0
);

// Main upper structure
addBox(
    palace, 3.5, 1.3, 2.5,
    wallMaterial, 0, 4.65, 0
);

// Decorative golden band
addBox(
    palace, 5.15, 0.13, 2.6,
    goldMaterial, 0, 4.05, 0
);

// ------------------------------
// 6. PALACE TOWERS
// ------------------------------

function createTower(x, height) {

    const tower = new THREE.Group();

    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.75, 0.85, height, 12),
        wallMaterial
    );

    base.position.y = height / 2;
    base.castShadow = true;
    tower.add(base);

    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(0.95, 1.6, 12),
        roofMaterial
    );

    roof.position.y = height + 0.8;
    roof.castShadow = true;
    tower.add(roof);

    const roofTip = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        goldMaterial
    );

    roofTip.position.y = height + 1.65;
    tower.add(roofTip);

    tower.position.set(x, 0, 0);

    palace.add(tower);
}

createTower(-2.8, 4.8);
createTower(2.8, 4.8);

// Smaller side towers
createTower(-5, 3.1);
createTower(5, 3.1);

// ------------------------------
// 7. PALACE ENTRANCE
// ------------------------------

// Door frames
addBox(
    palace, 2.8, 3.1, 0.3,
    goldMaterial, 0, 1.55, 1.35
);

// Door opening
addBox(
    palace, 2.35, 2.85, 0.25,
    roofMaterial, 0, 1.45, 1.53
);

// Left door pivot
const leftPivot = new THREE.Group();
leftPivot.position.set(-1.15, 0, 1.7);
palace.add(leftPivot);

const leftDoor = addBox(
    leftPivot, 1.15, 2.65, 0.15,
    doorMaterial, 0.575, 1.35, 0
);

// Right door pivot
const rightPivot = new THREE.Group();
rightPivot.position.set(1.15, 0, 1.7);
palace.add(rightPivot);

const rightDoor = addBox(
    rightPivot, 1.15, 2.65, 0.15,
    doorMaterial, -0.575, 1.35, 0
);

// Golden door decorations
const leftDecoration = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 1.8, 0.05),
    goldMaterial
);

leftDecoration.position.set(0.55, 1.35, 0.1);
leftPivot.add(leftDecoration);

const rightDecoration = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 1.8, 0.05),
    goldMaterial
);

rightDecoration.position.set(-0.55, 1.35, 0.1);
rightPivot.add(rightDecoration);

// ------------------------------
// 8. FRONT STAIRS
// ------------------------------

for (let i = 0; i < 5; i++) {

    addBox(
        palace,
        4 - i * 0.35,
        0.22,
        0.7,
        goldMaterial,
        0,
        0.11 + i * 0.22,
        2.1 + i * 0.48
    );
}

// ------------------------------
// 9. DECORATIVE WINDOWS
// ------------------------------

function addWindow(x, y, z) {

    const windowMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 1, 0.12),
        new THREE.MeshStandardMaterial({
            color: '#f5c77c',
            emissive: '#a85c37',
            emissiveIntensity: 0.6
        })
    );

    windowMesh.position.set(x, y, z);
    palace.add(windowMesh);
}

addWindow(-1.9, 2.5, 1.3);
addWindow(1.9, 2.5, 1.3);

// ------------------------------
// 10. DECORATIVE SUN
// ------------------------------

const sun = new THREE.Mesh(
    new THREE.SphereGeometry(1.4, 32, 32),
    new THREE.MeshBasicMaterial({
        color: '#ffd39a'
    })
);

sun.position.set(-7, 7, -15);
scene.add(sun);

// ------------------------------
// 11. DOOR ANIMATION
// ------------------------------

let doorsOpen = false;
let animationStarted = false;

const enterButton = document.getElementById('enterButton');
const welcomeSection = document.getElementById('welcomeSection');
const backButton = document.getElementById('backButton');

enterButton.addEventListener('click', () => {

    if (animationStarted) return;

    animationStarted = true;
    enterButton.disabled = true;

    doorsOpen = true;

    setTimeout(() => {

        welcomeSection.classList.add('show');

        welcomeSection.scrollIntoView({
            behavior: 'smooth'
        });

        enterButton.disabled = false;
        animationStarted = false;

    }, 1400);
});

backButton.addEventListener('click', () => {

    welcomeSection.classList.remove('show');

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ------------------------------
// 12. ANIMATION LOOP
// ------------------------------

function animate() {

    requestAnimationFrame(animate);

    if (doorsOpen) {

        leftPivot.rotation.y = THREE.MathUtils.lerp(
            leftPivot.rotation.y,
            -1.35,
            0.045
        );

        rightPivot.rotation.y = THREE.MathUtils.lerp(
            rightPivot.rotation.y,
            1.35,
            0.045
        );
    }

    renderer.render(scene, camera);
}

animate();

// ------------------------------
// 13. RESPONSIVE SCREEN
// ------------------------------

window.addEventListener('resize', () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );
});

// ------------------------------
// PHASE 3 - ROYAL GALLERY
// ------------------------------

const galleryButton = document.getElementById("galleryButton");

const gallerySection = document.getElementById("gallerySection");

const galleryBackButton = document.getElementById("galleryBackButton");

// Open Royal Gallery
galleryButton.addEventListener("click", () => {

    welcomeSection.classList.remove("show");

    gallerySection.classList.add("show");

    gallerySection.scrollIntoView({
        behavior: "smooth"
    });

});

// Return to Welcome Section
galleryBackButton.addEventListener("click", () => {

    gallerySection.classList.remove("show");

    welcomeSection.classList.add("show");

    welcomeSection.scrollIntoView({
        behavior: "smooth"
    });

});

// ===================================
// PHASE 4 - THE ROYAL ROSE GARDEN
// ===================================

const gardenButton = document.getElementById("gardenButton");
const gardenSection = document.getElementById("gardenSection");
const gardenBackButton = document.getElementById("gardenBackButton");
const bloomButton = document.getElementById("bloomButton");

let gardenInitialized = false;
let gardenRenderer;
let gardenScene;
let gardenCamera;
let flowerGroups = [];

// Open Garden
gardenButton.addEventListener("click", () => {

    gallerySection.classList.remove("show");
    gardenSection.classList.add("show");

    gardenSection.scrollIntoView({
        behavior: "smooth"
    });

    if (!gardenInitialized) {
        createGarden();
        gardenInitialized = true;
    }

});

// Back to Gallery
gardenBackButton.addEventListener("click", () => {

    gardenSection.classList.remove("show");
    gallerySection.classList.add("show");

    gallerySection.scrollIntoView({
        behavior: "smooth"
    });

});

// ===================================
// CREATE GARDEN SCENE
// ===================================

function createGarden() {

    const gardenContainer = document.getElementById("gardenCanvas");

    gardenScene = new THREE.Scene();

    gardenScene.background = new THREE.Color("#263e36");
    gardenScene.fog = new THREE.Fog("#263e36", 15, 35);

    gardenCamera = new THREE.PerspectiveCamera(
        50,
        gardenContainer.clientWidth / gardenContainer.clientHeight,
        0.1,
        100
    );

    gardenCamera.position.set(0, 7, 14);
    gardenCamera.lookAt(0, 1, 0);

    gardenRenderer = new THREE.WebGLRenderer({
        antialias: true
    });

    gardenRenderer.setSize(
        gardenContainer.clientWidth,
        gardenContainer.clientHeight
    );

    gardenRenderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    gardenRenderer.shadowMap.enabled = true;

    gardenContainer.appendChild(gardenRenderer.domElement);

    // LIGHTS

    const gardenLight = new THREE.AmbientLight(
        "#ffffff",
        1.8
    );

    gardenScene.add(gardenLight);

    const moonLight = new THREE.DirectionalLight(
        "#ffe0b0",
        2.5
    );

    moonLight.position.set(-5, 10, 6);
    gardenScene.add(moonLight);

    // GROUND

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshStandardMaterial({
            color: "#345b43",
            roughness: 1
        })
    );

    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;

    gardenScene.add(ground);

    // PATHWAY

    const path = new THREE.Mesh(
        new THREE.PlaneGeometry(3.2, 18),
        new THREE.MeshStandardMaterial({
            color: "#bda58c",
            roughness: 0.9
        })
    );

    path.rotation.x = -Math.PI / 2;
    path.position.set(0, 0.01, 0);

    gardenScene.add(path);

    // FOUNTAIN BASE

    const fountainBase = new THREE.Mesh(
        new THREE.CylinderGeometry(1.8, 2, 0.45, 32),
        new THREE.MeshStandardMaterial({
            color: "#c7a879",
            metalness: 0.35,
            roughness: 0.4
        })
    );

    fountainBase.position.set(0, 0.22, -3);
    gardenScene.add(fountainBase);

    // FOUNTAIN WATER

    const water = new THREE.Mesh(
        new THREE.CylinderGeometry(1.65, 1.65, 0.12, 32),
        new THREE.MeshStandardMaterial({
            color: "#65b6c2",
            metalness: 0.5,
            roughness: 0.2
        })
    );

    water.position.set(0, 0.48, -3);
    gardenScene.add(water);

    // FOUNTAIN CENTRAL PILLAR

    const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.45, 1.6, 16),
        new THREE.MeshStandardMaterial({
            color: "#e1c28c",
            metalness: 0.3
        })
    );

    pillar.position.set(0, 1.2, -3);
    gardenScene.add(pillar);

    // FOUNTAIN TOP

    const topBowl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.75, 0.3, 0.25, 24),
        new THREE.MeshStandardMaterial({
            color: "#d9bd91",
            metalness: 0.4
        })
    );

    topBowl.position.set(0, 2, -3);
    gardenScene.add(topBowl);

    // ===================================
    // ROSE FLOWER CREATOR
    // ===================================

    function createFlower(x, z, color) {

        const flower = new THREE.Group();

        const stem = new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.045, 0.06, 1.4, 8
            ),
            new THREE.MeshStandardMaterial({
                color: "#32754b"
            })
        );

        stem.position.y = 0.7;
        flower.add(stem);

        // LEAVES

        for (let i = 0; i < 2; i++) {

            const leaf = new THREE.Mesh(
                new THREE.SphereGeometry(0.22, 12, 12),
                new THREE.MeshStandardMaterial({
                    color: "#4b995b"
                })
            );

            leaf.scale.set(1.4, 0.25, 0.5);

            leaf.position.set(
                i === 0 ? 0.18 : -0.18,
                0.65,
                0
            );

            leaf.rotation.z = i === 0 ? 0.3 : -0.3;

            flower.add(leaf);
        }

        // ROSE PETALS

        const petalMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.55
        });

        for (let i = 0; i < 8; i++) {

            const angle = (i / 8) * Math.PI * 2;

            const petal = new THREE.Mesh(
                new THREE.SphereGeometry(0.23, 12, 12),
                petalMaterial
            );

            petal.scale.set(1, 0.65, 1.3);

            petal.position.set(
                Math.cos(angle) * 0.23,
                1.48,
                Math.sin(angle) * 0.23
            );

            flower.add(petal);
        }

        // CENTER OF ROSE

        const center = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 16, 16),
            new THREE.MeshStandardMaterial({
                color: "#f7d77e"
            })
        );

        center.position.y = 1.5;
        flower.add(center);

        flower.position.set(x, 0, z);

        gardenScene.add(flower);

        flowerGroups.push(flower);
    }

    // ===================================
    // PLANT ROSES
    // ===================================

    const roseColors = [
        "#e95b83",
        "#f1a0bd",
        "#f6d2df",
        "#a94b72",
        "#e9a0a0"
    ];

    for (let i = 0; i < 18; i++) {

        const x = (i % 2 === 0 ? -1 : 1) *
                  (2.5 + Math.random() * 3);

        const z = -6 + Math.random() * 12;

        const color = roseColors[
            i % roseColors.length
        ];

        createFlower(x, z, color);
    }

    // ===================================
    // GARDEN TREES
    // ===================================

    function createTree(x, z) {

        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.2, 0.28, 2, 10
            ),
            new THREE.MeshStandardMaterial({
                color: "#795238"
            })
        );

        trunk.position.set(x, 1, z);
        gardenScene.add(trunk);

        const leaves = new THREE.Mesh(
            new THREE.SphereGeometry(1.2, 16, 16),
            new THREE.MeshStandardMaterial({
                color: "#477b51"
            })
        );

        leaves.position.set(x, 2.6, z);
        leaves.scale.set(1, 1.2, 1);
        gardenScene.add(leaves);
    }

    createTree(-7, -5);
    createTree(7, -5);
    createTree(-7, 5);
    createTree(7, 5);

    // ===================================
    // GARDEN LIGHTS
    // ===================================

    for (let i = 0; i < 12; i++) {

        const x = i % 2 === 0 ? -2.1 : 2.1;
        const z = -5 + Math.floor(i / 2) * 1.8;

        const lightBall = new THREE.Mesh(
            new THREE.SphereGeometry(0.09, 12, 12),
            new THREE.MeshBasicMaterial({
                color: "#ffe4a1"
            })
        );

        lightBall.position.set(x, 0.4, z);
        gardenScene.add(lightBall);

        const pointLight = new THREE.PointLight(
            "#ffd28a",
            0.7,
            3
        );

        pointLight.position.copy(lightBall.position);
        gardenScene.add(pointLight);
    }

    // ===================================
    // MAKE GARDEN BLOOM
    // ===================================

    bloomButton.addEventListener("click", () => {

        flowerGroups.forEach((flower, index) => {

            setTimeout(() => {

                flower.scale.set(1.3, 1.3, 1.3);

                setTimeout(() => {
                    flower.scale.set(1, 1, 1);
                }, 700);

            }, index * 60);

        });

    });

    // ===================================
    // ANIMATION LOOP
    // ===================================

    function animateGarden() {

        requestAnimationFrame(animateGarden);

        flowerGroups.forEach((flower, index) => {

            flower.rotation.y =
                Math.sin(Date.now() * 0.0005 + index) * 0.06;

        });

        gardenRenderer.render(
            gardenScene,
            gardenCamera
        );
    }

    animateGarden();

}

// ===================================
// GARDEN RESIZE
// ===================================

window.addEventListener("resize", () => {

    if (!gardenInitialized) return;

    const gardenContainer = document.getElementById("gardenCanvas");

    gardenCamera.aspect =
        gardenContainer.clientWidth /
        gardenContainer.clientHeight;

    gardenCamera.updateProjectionMatrix();

    gardenRenderer.setSize(
        gardenContainer.clientWidth,
        gardenContainer.clientHeight
    );

    gardenRenderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

});
// ROYAL WISH WALL

const wishButton = document.getElementById("wishButton");
const wishSection = document.getElementById("wishSection");
const wishBackButton = document.getElementById("wishBackButton");

const wishForm = document.getElementById("wishForm");
const wishInput = document.getElementById("wishInput");
const wishList = document.getElementById("wishList");

// Open Wish Wall
wishButton.addEventListener("click", () => {
    gardenSection.classList.remove("show");
    wishSection.classList.add("show");

    wishSection.scrollIntoView({
        behavior: "smooth"
    });
});

// Return to Garden
wishBackButton.addEventListener("click", () => {
    wishSection.classList.remove("show");
    gardenSection.classList.add("show");

    gardenSection.scrollIntoView({
        behavior: "smooth"
    });
});

// Load saved wishes
let savedWishes = JSON.parse(
    localStorage.getItem("royalWishes") || "[]"
);

function displayWish(wish) {
    const card = document.createElement("div");
    card.className = "wish-card";

    const star = document.createElement("span");
    star.textContent = "✦ A Royal Wish";

    const message = document.createElement("p");
    message.textContent = wish;

    card.appendChild(star);
    card.appendChild(message);

    wishList.prepend(card);
}

// Display old wishes
savedWishes.forEach(displayWish);

// Add a new wish
wishForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const wish = wishInput.value.trim();

    if (!wish) return;

    savedWishes.push(wish);

    localStorage.setItem(
        "royalWishes",
        JSON.stringify(savedWishes)
    );

    displayWish(wish);

    wishInput.value = "";
});

/* PHASE 6 — ROYAL SURPRISE BOX */

const surpriseButton = document.getElementById("surpriseButton");
const surpriseSection = document.getElementById("surpriseSection");
const surpriseBackButton = document.getElementById("surpriseBackButton");

const giftBox = document.getElementById("giftBox");
const giftHint = document.getElementById("giftHint");
const surpriseMessage = document.getElementById("surpriseMessage");

let giftOpened = false;

// Open Surprise Section
surpriseButton.addEventListener("click", () => {
    wishSection.classList.remove("show");
    surpriseSection.classList.add("show");

    surpriseSection.scrollIntoView({
        behavior: "smooth"
    });
});

// Open Gift
function openGift() {
    if (giftOpened) return;

    giftOpened = true;

    giftBox.classList.add("opened");
    giftHint.textContent = "Your surprise has arrived! ✨";

    setTimeout(() => {
        surpriseMessage.classList.add("show");
    }, 700);

    createSparkles();
}

// Click and keyboard support
giftBox.addEventListener("click", openGift);

giftBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openGift();
    }
});

// Golden Sparkles
function createSparkles() {
    const container = document.querySelector(".gift-container");

    for (let i = 0; i < 22; i++) {
        const sparkle = document.createElement("span");

        sparkle.textContent = "✦";
        sparkle.style.position = "absolute";
        sparkle.style.color = "#ffdf91";
        sparkle.style.fontSize = "20px";
        sparkle.style.left = Math.random() * 90 + "%";
        sparkle.style.top = Math.random() * 90 + "%";
        sparkle.style.pointerEvents = "none";
        sparkle.style.animation = "surpriseReveal 1.5s ease forwards";

        container.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 1600);
    }
}

// Back to Wish Wall
surpriseBackButton.addEventListener("click", () => {
    surpriseSection.classList.remove("show");
    wishSection.classList.add("show");

    wishSection.scrollIntoView({
        behavior: "smooth"
    });
});

/* PHASE 7 — ROYAL MUSIC PLAYER */

const musicButton = document.getElementById("musicButton");
const musicSection = document.getElementById("musicSection");
const musicBackButton = document.getElementById("musicBackButton");

const royalAudio = document.getElementById("royalAudio");
const playButton = document.getElementById("playButton");
const muteButton = document.getElementById("muteButton");

const volumeSlider = document.getElementById("volumeSlider");
const volumeValue = document.getElementById("volumeValue");
const musicStatus = document.getElementById("musicStatus");

const musicPlayer = document.querySelector(".music-player");

// Default volume
royalAudio.volume = 0.5;

// Open Music Room
musicButton.addEventListener("click", () => {
    surpriseSection.classList.remove("show");
    musicSection.classList.add("show");

    musicSection.scrollIntoView({
        behavior: "smooth"
    });
});

// Play / Pause
playButton.addEventListener("click", async () => {

    if (royalAudio.paused) {

        try {
            await royalAudio.play();

            playButton.textContent = "Ⅱ";
            playButton.setAttribute("aria-label", "Pause music");
            musicStatus.textContent = "Now Playing ✨";
            musicPlayer.classList.add("playing");

        } catch (error) {
            musicStatus.textContent =
                "Music could not play. Check your audio file.";
        }

    } else {

        royalAudio.pause();

        playButton.textContent = "▶";
        playButton.setAttribute("aria-label", "Play music");
        musicStatus.textContent = "Music Paused";
        musicPlayer.classList.remove("playing");
    }
});

// Volume Control
volumeSlider.addEventListener("input", () => {

    royalAudio.volume = Number(volumeSlider.value);

    volumeValue.textContent =
        Math.round(royalAudio.volume * 100) + "%";

    if (royalAudio.volume > 0 && royalAudio.muted) {
        royalAudio.muted = false;
        muteButton.textContent = "🔊";
    }
});

// Mute / Unmute
muteButton.addEventListener("click", () => {

    royalAudio.muted = !royalAudio.muted;

    muteButton.textContent =
        royalAudio.muted ? "🔇" : "🔊";

    musicStatus.textContent =
        royalAudio.muted ? "Music Muted" : "Music Unmuted";
});

// Update when audio ends or fails
royalAudio.addEventListener("error", () => {
    musicStatus.textContent =
        "Audio file not found. Check audio/royal-ambience.mp3";
});

// Back to Surprise
musicBackButton.addEventListener("click", () => {

    musicSection.classList.remove("show");
    surpriseSection.classList.add("show");

    musicSection.scrollIntoView({
        behavior: "smooth"
    });
});

/* PHASE 8 — ROYAL NIGHT SKY */

const skyButton = document.getElementById("skyButton");
const skySection = document.getElementById("skySection");
const skyBackButton = document.getElementById("skyBackButton");
const shootingStarButton = document.getElementById("shootingStarButton");

const skyCanvas = document.getElementById("skyCanvas");
const skyContext = skyCanvas.getContext("2d");

let stars = [];
let shootingStars = [];
let skyAnimationId;
let skyInitialized = false;

function resizeSky() {
    const rect = skySection.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    skyCanvas.width = width * dpr;
    skyCanvas.height = height * dpr;

    skyContext.setTransform(dpr, 0, 0, dpr, 0, 0);

    stars = [];

    for (let i = 0; i < 140; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 0.4,
            opacity: Math.random(),
            speed: Math.random() * 0.025 + 0.005
        });
    }
}

function drawSky() {
    const width = skySection.clientWidth;
    const height = skySection.clientHeight;

    skyContext.clearRect(0, 0, width, height);

    // Draw twinkling stars
    stars.forEach(star => {
        star.opacity += star.speed;

        if (star.opacity >= 1 || star.opacity <= 0.2) {
            star.speed *= -1;
        }

        skyContext.beginPath();
        skyContext.arc(
            star.x,
            star.y,
            star.radius,
            0,
            Math.PI * 2
        );

        skyContext.fillStyle =
            `rgba(255, 239, 190, ${star.opacity})`;

        skyContext.shadowBlur = 8;
        skyContext.shadowColor = "#ffe3a0";
        skyContext.fill();
    });

    skyContext.shadowBlur = 0;

    // Draw shooting stars
    shootingStars.forEach((star, index) => {
        star.x += star.speedX;
        star.y += star.speedY;
        star.opacity -= 0.012;

        skyContext.beginPath();
        skyContext.moveTo(star.x, star.y);
        skyContext.lineTo(
            star.x - 85,
            star.y - 35
        );

        skyContext.strokeStyle =
            `rgba(255, 230, 170, ${Math.max(0, star.opacity)})`;

        skyContext.lineWidth = 2;
        skyContext.stroke();

        if (star.opacity <= 0) {
            shootingStars.splice(index, 1);
        }
    });

    skyAnimationId = requestAnimationFrame(drawSky);
}

// Create a shooting star
function makeShootingStar() {
    shootingStars.push({
        x: Math.random() * skySection.clientWidth,
        y: Math.random() * (skySection.clientHeight * 0.5),
        speedX: 7,
        speedY: 3,
        opacity: 1
    });
}

// Initialize animation once
function startSky() {
    if (skyInitialized) return;

    resizeSky();
    drawSky();

    skyInitialized = true;
}

// Open Night Sky
skyButton.addEventListener("click", () => {
    musicSection.classList.remove("show");
    skySection.classList.add("show");

    startSky();

    skySection.scrollIntoView({
        behavior: "smooth"
    });
});

// Shooting Star button
shootingStarButton.addEventListener("click", () => {
    makeShootingStar();
});

// Back to Music Room
skyBackButton.addEventListener("click", () => {
    skySection.classList.remove("show");
    musicSection.classList.add("show");

    skySection.scrollIntoView({
        behavior: "smooth"
    });
});

// Resize canvas
window.addEventListener("resize", () => {
    if (skyInitialized) {
        resizeSky();
    }
});

/* PHASE 9 — ROYAL NAVIGATION */

const royalNavButtons = document.querySelectorAll(
    ".nav-links button"
);

const royalPages = [
    "welcomeSection",
    "gallerySection",
    "gardenSection",
    "wishSection",
    "surpriseSection",
    "musicSection",
    "skySection"
];

function navigateToPage(pageId) {

    const targetPage = document.getElementById(pageId);

    if (!targetPage) {
        console.error("Page not found:", pageId);
        return;
    }

    // Hide all sections
    royalPages.forEach(id => {
        const page = document.getElementById(id);

        if (page) {
            page.classList.remove("show");
        }
    });

    // Show selected section
    targetPage.classList.add("show");

    // Update active navigation button
    royalNavButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === pageId
        );
    });

    // Scroll to selected section
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Navigation click events
royalNavButtons.forEach(button => {

    button.addEventListener("click", () => {
        navigateToPage(button.dataset.page);
    });

});

// Logo click — Home
const navLogo = document.querySelector(".nav-logo");

navLogo.addEventListener("click", (event) => {
    event.preventDefault();
    navigateToPage("welcomeSection");
});

// Keep navigation active state updated
document.addEventListener("click", (event) => {

    const backButton = event.target.closest(".back-button");

    if (!backButton) return;

    setTimeout(() => {

        const visiblePage = royalPages.find(id => {
            const page = document.getElementById(id);

            return page && page.classList.contains("show");
        });

        if (visiblePage) {
            royalNavButtons.forEach(button => {
                button.classList.toggle(
                    "active",
                    button.dataset.page === visiblePage
                );
            });
        }

    }, 100);

});

// =================================
// PHASE 10 - ROYAL INTRO FUNCTION
// =================================


/* =================================
   PHASE 10 - ROYAL DOOR CONTROL
================================= */

const royalIntro = document.getElementById("royalIntro");

const startJourneyButton =
    document.getElementById("startJourneyButton");

const skipIntroButton =
    document.getElementById("skipIntroButton");

const introAudio =
    document.getElementById("introAudio");

let introClosed = false;

function closeRoyalIntro(playSound = false) {

    if (introClosed) return;

    introClosed = true;

    if (playSound && introAudio) {

        introAudio.currentTime = 0;
        introAudio.volume = 0.35;

        introAudio.play().catch(error => {
            console.log("Intro audio unavailable:", error);
        });

    }

    royalIntro.classList.add("open-doors");

    setTimeout(() => {

        royalIntro.classList.add("hide");

    }, 2000);

}

startJourneyButton.addEventListener("click", () => {
    closeRoyalIntro(true);
});

skipIntroButton.addEventListener("click", () => {
    closeRoyalIntro(false);
});


/* =================================
   ROYAL CROWN CAMERA - FACE TRACKING
================================= */

const cameraVideo = document.getElementById("cameraVideo");
const crownCanvas = document.getElementById("crownCanvas");
const cameraCtx = crownCanvas.getContext("2d");

const startCameraButton = document.getElementById("startCameraButton");
const captureButton = document.getElementById("captureButton");
const stopCameraButton = document.getElementById("stopCameraButton");

const cameraStatus = document.getElementById("cameraStatus");
const cameraPlaceholder = document.getElementById("cameraPlaceholder");
const downloadPhoto = document.getElementById("downloadPhoto");

let cameraStream = null;
let faceLandmarker = null;
let cameraAnimation = null;
let lastVideoTime = -1;

async function loadFaceTracker() {

    if (faceLandmarker) return;

    cameraStatus.textContent = "Loading royal camera...";

    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
    );

    faceLandmarker = await FaceLandmarker.createFromOptions(
        vision,
        {
            baseOptions: {
                modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                delegate: "CPU"
            },

            runningMode: "VIDEO",
            numFaces: 1
        }
    );
}

async function startRoyalCamera() {

    try {

        cameraStatus.textContent = "Requesting camera permission...";

        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });

        cameraVideo.srcObject = cameraStream;

        await cameraVideo.play();

        await loadFaceTracker();

        crownCanvas.width = cameraVideo.videoWidth;
        crownCanvas.height = cameraVideo.videoHeight;

        cameraPlaceholder.style.display = "none";

        startCameraButton.disabled = true;
        captureButton.disabled = false;
        stopCameraButton.disabled = false;

        cameraStatus.textContent = "Royal camera is active ✨";

        detectRoyalFace();

    } catch (error) {

        console.error(error);

        cameraStatus.textContent =
            "Camera could not start. Check permission and connection.";

        stopRoyalCamera();

    }
}

function detectRoyalFace() {

    if (!cameraStream || !faceLandmarker) return;

    if (cameraVideo.readyState >= 2 &&
        cameraVideo.currentTime !== lastVideoTime) {

        lastVideoTime = cameraVideo.currentTime;

        const results = faceLandmarker.detectForVideo(
            cameraVideo,
            performance.now()
        );

        cameraCtx.clearRect(
            0, 0,
            crownCanvas.width,
            crownCanvas.height
        );

        if (results.faceLandmarks.length > 0) {

            const landmarks = results.faceLandmarks[0];

            const top = landmarks[10];
            const left = landmarks[234];
            const right = landmarks[454];

            const centerX =
                (left.x + right.x) / 2 * crownCanvas.width;

            const topY = top.y * crownCanvas.height;

            const faceWidth =
                Math.abs(right.x - left.x) * crownCanvas.width;

            const crownSize = faceWidth * 0.42;

            cameraCtx.save();

            cameraCtx.textAlign = "center";
            cameraCtx.textBaseline = "middle";

            cameraCtx.font = `${crownSize}px serif`;

            cameraCtx.shadowColor = "#ffd36b";
            cameraCtx.shadowBlur = 20;

            cameraCtx.fillStyle = "#ffd36b";

            cameraCtx.fillText(
                "👑",
                centerX,
                topY - crownSize * 0.38
            );

            cameraCtx.restore();

            cameraStatus.textContent =
                "Your royal crown is ready! 👑";

        } else {

            cameraStatus.textContent =
                "Position your face inside the camera.";

        }

    }

    cameraAnimation = requestAnimationFrame(detectRoyalFace);

}

function captureRoyalPhoto() {

    if (!cameraStream) return;

    const photoCanvas = document.createElement("canvas");

    photoCanvas.width = cameraVideo.videoWidth;
    photoCanvas.height = cameraVideo.videoHeight;

    const photoCtx = photoCanvas.getContext("2d");

    // Mirror the final photo
    photoCtx.translate(photoCanvas.width, 0);
    photoCtx.scale(-1, 1);

    photoCtx.drawImage(
        cameraVideo,
        0, 0,
        photoCanvas.width,
        photoCanvas.height
    );

    photoCtx.drawImage(
        crownCanvas,
        0, 0
    );

    downloadPhoto.href = photoCanvas.toDataURL("image/png");

    downloadPhoto.hidden = false;

    downloadPhoto.click();

    cameraStatus.textContent =
        "Your royal photo has been captured! ✨";

}

function stopRoyalCamera() {

    if (cameraAnimation) {
        cancelAnimationFrame(cameraAnimation);
        cameraAnimation = null;
    }

    if (cameraStream) {

        cameraStream.getTracks().forEach(track => track.stop());

        cameraStream = null;

    }

    cameraVideo.srcObject = null;

    cameraCtx.clearRect(
        0, 0,
        crownCanvas.width,
        crownCanvas.height
    );

    cameraPlaceholder.style.display = "flex";

    startCameraButton.disabled = false;
    captureButton.disabled = true;
    stopCameraButton.disabled = true;

    cameraStatus.textContent = "Camera is currently off.";

}

startCameraButton.addEventListener("click", startRoyalCamera);

captureButton.addEventListener("click", captureRoyalPhoto);

stopCameraButton.addEventListener("click", stopRoyalCamera);

// Back to Night Sky
document.getElementById("cameraBackButton").addEventListener(
    "click",
    () => {
        stopRoyalCamera();
        document.querySelector('[data-page="skySection"]').click();
    }
);
