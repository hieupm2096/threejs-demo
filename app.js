var WIDTH = 640,
    HEIGHT = 360;

var camera, controls, scene, renderer;
var children = [];

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 1000);
    camera.position.z = 500;
    camera.rotation.x = 1;
    camera.rotation.y = 0.5;

    // we want to control our camera
    controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 2;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    var geometry = new THREE.CubeGeometry(300, 200, 200);

    var edges = new THREE.EdgesGeometry(geometry);
    var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
        color: 0x000000
    }));

    scene.add(line);

    var material = new THREE.MeshNormalMaterial({
        transparent: true,
        opacity: 0
    });

    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    var geometry_child = new THREE.BoxBufferGeometry(100, 100, 100);
    var material_child = new THREE.MeshNormalMaterial();
    var mesh_child = new THREE.Mesh(geometry_child, material_child);
    mesh_child.position.set(0, 0, 0);

    mesh.add(mesh_child);

    children.push(mesh_child);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(WIDTH, HEIGHT);

    document.getElementById("container").appendChild(renderer.domElement);

    var dragControls = new THREE.DragControls(children, camera, renderer.domElement);
    dragControls.addEventListener('dragstart', dragStartCallback);
    dragControls.addEventListener('dragend', dragEndCallback);
};

function dragStartCallback() {
    controls.enabled = false;
}

function dragEndCallback() {
    controls.enabled = true;
}

function animate() {
    requestAnimationFrame(animate);
    render();
};


function render() {
    controls.update();
    renderer.render(scene, camera);
}