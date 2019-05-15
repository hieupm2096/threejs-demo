var WIDTH = 640,
    HEIGHT = 360;

var camera, controls, scene, renderer, transformControls;
var dragItem, draggable = false;
var startColor;
var mouse = new THREE.Vector2();
var collidableMesh = [];
var movingObject;

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 1000);
    camera.position.set(400, 400, 100);

    // init scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // grid helper
    var size = 400;
    var divisions = 10;

    // init floor, ceiling and walls: floor and ceiling: 400 * 400 * 600 (w * h * l)
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(400, 600), new THREE.MeshBasicMaterial({

    }));
    floor.rotation.x = Math.PI / 2;
    collidableMesh.push(floor);
    scene.add(floor);

    var ceiling = new THREE.Mesh(new THREE.PlaneGeometry(400, 600), new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0
    }));
    ceiling.position.set(0, 200, 0);
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);

    // add light, MeshLambertMaterial cannot show color if no light
    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    // adding cube
    // var geometry = new THREE.CubeGeometry(300, 200, 200);

    // var edges = new THREE.EdgesGeometry(geometry);
    // var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
    //     color: 0x000000
    // }));

    // var material = new THREE.MeshLambertMaterial({
    //     transparent: true,
    //     opacity: 0
    // });

    // var mesh = new THREE.Mesh(geometry, material);
    // mesh.position.set(0, 0, 0);
    // scene.add(mesh);
    // mesh.add(line);

    var cubeGeometry = new THREE.BoxBufferGeometry(100, 100, 100);
    var cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xba5ced,
    });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 50, 0);

    collidableMesh.push(cube);
    scene.add(cube);

    // init renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(WIDTH, HEIGHT);

    document.getElementById("container").appendChild(renderer.domElement);

    // controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 700;
    controls.maxPolarAngle = Math.PI / 2;

    // transform control
    transformControls = new THREE.TransformControls(camera, renderer.domElement);
    transformControls.addEventListener('change', render);
    transformControls.addEventListener('dragging-changed', onDraggingChanged);
    transformControls.attach(cube);
    scene.add(transformControls);

    var floorBoxHelper = new THREE.BoxHelper(floor, 0xff0000);
    scene.add(floorBoxHelper);
    var floorBox3 = new THREE.Box3();
    floorBox3.setFromObject(floorBoxHelper);

    var ceilingBoxHelper = new THREE.BoxHelper(ceiling, 0xff0000);
    scene.add(ceilingBoxHelper);
    var ceilingBox3 = new THREE.Box3();
    ceilingBox3.setFromObject(ceilingBoxHelper);

    var cubeBoxHelper = new THREE.BoxHelper(cube, 0xff0000);
    scene.add(cubeBoxHelper);
    var cubeBox3 = new THREE.Box3();
    cubeBox3.setFromObject(cubeBoxHelper)
    if (floorBox3.intersectsBox(cubeBox3)) {
        console.log('intersect')
    } else {
        console.log('not intersect');
    }

};

function animate() {
    requestAnimationFrame(animate);
    render();
};

function render() {
    controls.update();
    renderer.render(scene, camera);
}

function onDraggingChanged(event) {
    console.log('draggin')
    controls.enabled = !event.value;

}