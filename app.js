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

    // init scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // add light, MeshLambertMaterial cannot show color if no light
    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    // adding cube
    var geometry = new THREE.CubeGeometry(300, 200, 200);

    var edges = new THREE.EdgesGeometry(geometry);
    var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
        color: 0x000000
    }));

    var material = new THREE.MeshLambertMaterial({
        transparent: true,
        opacity: 0
    });

    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    mesh.add(line);

    var geometry_child = new THREE.BoxBufferGeometry(100, 100, 100);
    var material_child = new THREE.MeshLambertMaterial({
        color: 0xba5ced,
    });
    var mesh_child = new THREE.Mesh(geometry_child, material_child);
    mesh_child.position.set(0, 0, 0);

    mesh.add(mesh_child);
    children.push(mesh_child);

    // init renderer
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