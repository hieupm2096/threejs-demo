var WIDTH = 640,
    HEIGHT = 360;

var camera, controls, scene, renderer, dragControls;
var dragItem, dragItemBoxHelper, dragItemBox3;
var startColor;
var mouse = new THREE.Vector2();
var collidableMesh = [];
var cubes = [];
var walls = [];

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 1, 1000);
    camera.position.set(400, 150, 400);
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Set look at coordinate like this

    // init scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // init floor, ceiling and walls: floor and ceiling: 400 * 400 * 600 (w * h * l)
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(400, 600), new THREE.MeshBasicMaterial());
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

    // floor box
    var floorBoxHelper = new THREE.BoxHelper(floor, 0xff0000);
    scene.add(floorBoxHelper);

    var ceiling = new THREE.Mesh(new THREE.PlaneGeometry(400, 600), new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0
    }));
    ceiling.position.set(0, 200, 0);
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);

    // ceiling box
    var ceilingBoxHelper = new THREE.BoxHelper(ceiling, 0xff0000);
    scene.add(ceilingBoxHelper);

    var leftWall = new THREE.Mesh(new THREE.PlaneGeometry(400, 200), new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0
    }));
    leftWall.position.set(0, 100, 300);
    scene.add(leftWall);

    // left wall box
    var leftWallBoxHelper = new THREE.BoxHelper(leftWall, 0xff0000);
    scene.add(leftWallBoxHelper);

    // right wall
    var rightWall = new THREE.Mesh(new THREE.PlaneGeometry(400, 200), new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0
    }));
    rightWall.position.set(0, 100, -300);
    scene.add(rightWall);

    // right wall box
    var rightWallBoxHelper = new THREE.BoxHelper(rightWall, 0xff0000);
    scene.add(rightWallBoxHelper);

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
        color: 0xffffff,
    });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 50, 0);
    console.log(cube.position);

    collidableMesh.push(cube);
    cubes.push(cube);
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
    controls.rotateSpeed = 0.1;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 700;
    controls.maxPolarAngle = Math.PI / 2;

    // transform control
    // transformControls = new THREE.TransformControls(camera, renderer.domElement);
    // transformControls.addEventListener('change', render);
    // transformControls.addEventListener('dragging-changed', onDraggingChanged);
    // transformControls.attach(cube);
    // scene.add(transformControls);

    // drag controls
    dragControls = new THREE.DragControls(cubes, camera, renderer.domElement);
    dragControls.addEventListener('dragstart', onDragStart);
    dragControls.addEventListener('dragend', onDragEnd);
    dragControls.addEventListener('drag', onDrag);

    // if (floorBox3.intersectsBox(cubeBox3)) {
    //     console.log('intersect')
    // } else {
    //     console.log('not intersect');
    // }

};

function animate() {
    requestAnimationFrame(animate);
    render();
};

function render() {
    controls.update();
    renderer.render(scene, camera);
}

function onDragStart(event) {
    controls.enabled = false;
    dragItem = event.object;
    dragItemBoxHelper = new THREE.BoxHelper(dragItem, 0xff0000);
    scene.add(dragItemBoxHelper);

    dragItemBox3 = new THREE.Box3();
    dragItemBox3.setFromObject(dragItemBoxHelper);
}

function onDrag(event) {
    var position = dragItem.position;
    if (position.x < -150) {
        position.x = -150
    } else if (position.x > 150) {
        position.x = 150;
    }
    if (position.y < 50) {
        position.y = 50
    } else if (position.y > 150) {
        position.y = 150;
    }
    if (position.z < -250) {
        position.z = -250;
    } else if (position.z > 250) {
        position.z = 250;
    }

    dragItemBoxHelper.update();
    dragItemBox3.setFromObject(dragItemBoxHelper);
    // for (const wall of walls) {
    //     if (dragItemBox3.intersectsBox(wall.box3)) {
    //         // dragItem.position.set(dragItem.position.x, 50, dragItem.position.z);
    //         // dragItemBoxHelper.update();
    //         // dragItemBox3.setFromObject(dragItemBoxHelper);
    //         switch (wall.type) {
    //             case 'floor':
    //                 dragItem.position.set(dragItem.position.x, 50, dragItem.position.z);
    //                 dragItemBoxHelper.update();
    //                 dragItemBox3.setFromObject(dragItemBoxHelper);
    //                 break;

    //             default:
    //                 break;
    //         }
    //     }
    // }
}

function onDragEnd(event) {
    console.log(dragItem.position);
    controls.enabled = true;
    dragItem = undefined;
    scene.remove(dragItemBoxHelper);
    dragItemBoxHelper = undefined;
    dragItemBox3 = undefined;
}