(function() {
    'use strict';

    var projects = document.getElementById('projects');
    if (!projects) return;

    var demos = projects.querySelectorAll('.project-demo');

    demos.forEach(function(demo) {
        var frame = demo.querySelector('iframe');

        // Load only when expanded; unloading also stops hidden playback.
        demo.addEventListener('toggle', function() {
            if (demo.open)
                frame.setAttribute('src', frame.getAttribute('data-src'));
            else
                frame.removeAttribute('src');
        });
    });

    function closeDemos() {
        demos.forEach(function(demo) { demo.open = false; });
    }

    // Stop playback when leaving or closing the Projects panel.
    window.addEventListener('hashchange', function() {
        if (window.location.hash.split('/')[0] !== '#projects') closeDemos();
    });
    projects.addEventListener('click', function(event) {
        if (event.target.closest('.close')) closeDemos();
    });

    // The existing page can also close on Escape or an outside click.
    new MutationObserver(function() {
        if (!projects.classList.contains('active')) closeDemos();
    }).observe(projects, { attributes: true, attributeFilter: ['class'] });
})();
