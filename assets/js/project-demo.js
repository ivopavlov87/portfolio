(function() {
    'use strict';

    var demo = document.getElementById('kings-line-demo');
    if (!demo) return;

    var frame = demo.querySelector('iframe');

    // Load only when expanded; unloading also stops hidden playback.
    demo.addEventListener('toggle', function() {
        if (demo.open)
            frame.setAttribute('src', frame.getAttribute('data-src'));
        else
            frame.removeAttribute('src');
    });

    // Stop playback when leaving or closing the Projects panel.
    window.addEventListener('hashchange', function() {
        if (window.location.hash !== '#projects') demo.open = false;
    });
    document.getElementById('projects').addEventListener('click', function(event) {
        if (event.target.closest('.close')) demo.open = false;
    });
})();
