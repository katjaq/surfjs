'use strict';

function Surf(myParams) {
  var me = {
    surfPath: null,     // path to Surf

/*libraries when working locally*/
/*
    three_url: 'http://localhost/libs/three.js/70/three.min.js',
    trackball_url: 'http://localhost/libs/three.js/70/TrackballControls.js',
    lzma_url: 'http://localhost/libs/three.js/70/lzma.js',
    ctm_url: 'http://localhost/libs/three.js/70/ctm.js',
    CTMWorker_url: 'http://localhost/libs/three.js/70/CTMWorker.js',
    CTMLoader_url: 'http://localhost/libs/three.js/70/CTMLoader.js',
*/
    three_url: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/70/three.min.js',
    trackball_url: 'https://cdn.rawgit.com/mrdoob/three.js/r70/examples/js/controls/TrackballControls.js',
    lzma_url: 'https://cdn.rawgit.com/mrdoob/three.js/r70/examples/js/loaders/ctm/lzma.js',
    ctm_url: 'https://cdn.rawgit.com/mrdoob/three.js/r70/examples/js/loaders/ctm/ctm.js',
    CTMWorker_url: 'https://cdn.rawgit.com/mrdoob/three.js/r70/examples/js/loaders/ctm/CTMWorker.js',
    CTMLoader_url: 'https://cdn.rawgit.com/mrdoob/three.js/r70/examples/js/loaders/ctm/CTMLoader.js',


    debug: 0,
    W: null,                // width
    H: null,                // height
    elem: null,             // Dom element to display the surface viewer
    camera: null,
    scene:null,
    renderer: null,
    trackball: null,
    mesh: null,
    // script loader
    loadScript: function loadScript(path, testScriptPresent) {
      var pr = new Promise(function(resolve, reject) {
          console.log(testScriptPresent, testScriptPresent());
          if (testScriptPresent && testScriptPresent()) {
            console.log('Script', path, 'already present, not loading it again');
            resolve();
            return;
          }
          var s = document.createElement('script');
          s.src = path;
          s.onload = function() {
              console.log('Loaded', path);
              resolve();
              return;
            };
          s.onerror = function() {
              console.error('ERROR');
              reject();
              return;
            };
          document.body.appendChild(s);
        });
      return pr;
    },
    init: function init() {
      var pr = new Promise(function(resolve, reject) {
          me.loadScript(me.three_url, function() {return window.THREE != undefined;})
          .then(function() {return me.loadScript(me.trackball_url, function() {return window.TrackballControls != undefined;});})
          .then(function() {return me.loadScript(me.lzma_url, function() {return window.lzma != undefined;});})
          .then(function() {return me.loadScript(me.ctm_url, function() {return window.ctm != undefined;});})
          .then(function() {return me.loadScript(me.CTMLoader_url, function() {return window.CTMLoader != undefined;});})
          .then(function() {return me.loadScript(me.CTMWorker_url, function() {return window.CTMLoader != undefined;});})
          .then(function() {
                me.W = $(me.elem).width();
                me.H = $(me.elem).height();

                me.camera = new THREE.PerspectiveCamera( 50, me.W / me.H, 1, 2000 );
                me.camera.position.z = 200;
                me.scene = new THREE.Scene();

                // RENDERER
                me.renderer = new THREE.WebGLRenderer( { antialias: true } );
                me.renderer.setPixelRatio( window.devicePixelRatio );
                me.renderer.setSize( me.W, me.H );
                me.renderer.domElement.style.position = "relative";
                me.elem.appendChild( me.renderer.domElement );
                me.trackball = new THREE.TrackballControls(me.camera,me.renderer.domElement);

                // EVENTS
                window.addEventListener( 'resize', me.onWindowResize, false );

                resolve();
            });
        });
        return pr;
    },
    configure: function configure() {
      var path = me.surfPath;
      console.log( 'loading mesh',path );
      var pr = new Promise( function( resolve, reject ) {
        var loader = new THREE.CTMLoader();
        loader.load( path, function( geometry ) {
            console.log('done');
            var material = new THREE.MeshNormalMaterial();
            me.mesh = new THREE.Mesh( geometry, material );
            while( me.scene.children.length > 0 )
                me.scene.remove( me.scene.children[0] );
            me.scene.add( me.mesh );
            resolve();
        });
      });
      return pr;
    },
    display: function display() {
        return me.init()
            .then(function () { return me.configure();})
            .then(function () { return me.animate();})
    },
    onWindowResize: function onWindowResize(e) {
        me.W = $(me.elem).width();
        me.H = $(me.elem).height();
        me.renderer.setSize( me.W, me.H );
        me.camera.aspect = me.W/me.H;
        me.camera.updateProjectionMatrix();
    },
    animate: function animate() {
        requestAnimationFrame( me.animate );
        me.render();
        me.camera.rotation.x += 0.001;
    },
    render: function render() {
        me.renderer.render( me.scene, me.camera );
        me.trackball.update();
    }
};

  // Check params
  if (!myParams.surfPath) {
    console.error('No surface path');
    return;
  }

  if (!myParams.elem) {
    console.error('No elem');
    return;
  }

  // Set params
  me.surfPath = myParams.surfPath;
  me.elem = myParams.elem;

  return me;
}
