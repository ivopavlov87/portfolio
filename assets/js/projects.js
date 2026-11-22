(function() {
    'use strict';

    var projects = document.getElementById('projects');
    if (!projects) return;

    var tabs = Array.from(projects.querySelectorAll('[role="tab"]'));
    var carousels = [];
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function syncCarousels() {
        carousels.forEach(function(carousel) { carousel.sync(); });
    }

    function selectTab(selected) {
        tabs.forEach(function(tab) {
            var active = tab === selected;
            var panel = document.getElementById(tab.getAttribute('aria-controls'));
            tab.setAttribute('aria-selected', String(active));
            tab.tabIndex = active ? 0 : -1;
            panel.hidden = !active;
            if (!active) {
                panel.querySelectorAll('.project-demo').forEach(function(demo) {
                    demo.open = false;
                });
            }
        });
        syncCarousels();
    }

    function selectTabFromHash() {
        if (window.location.hash === '#projects/3d-printing')
            selectTab(document.getElementById('printing-tab'));
        else if (window.location.hash === '#projects/coding')
            selectTab(document.getElementById('coding-tab'));
    }

    function navigateToTab(tab) {
        selectTab(tab);
        var category = tab.id === 'printing-tab' ? '3d-printing' : 'coding';
        window.history.replaceState(null, '', '#projects/' + category);
    }

    tabs.forEach(function(tab, index) {
        tab.addEventListener('click', function() { navigateToTab(tab); });
        tab.addEventListener('keydown', function(event) {
            var next;
            if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
            if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
            if (event.key === 'Home') next = 0;
            if (event.key === 'End') next = tabs.length - 1;
            if (next === undefined) return;
            event.preventDefault();
            tabs[next].focus();
            navigateToTab(tabs[next]);
        });
    });
    selectTab(tabs[0]);
    selectTabFromHash();
    window.addEventListener('hashchange', selectTabFromHash);
    projects.querySelector('.project-tabs').hidden = false;

    projects.querySelectorAll('.project-carousel').forEach(function(element) {
        var slides = Array.from(element.querySelectorAll('.project-carousel-slides img'));
        var panel = element.closest('.project-category');
        var status = element.querySelector('.project-carousel-status');
        var pause = element.querySelector('[data-carousel-action="pause"]');
        var current = 0;
        var timer = null;
        var inView = false;
        var paused = reducedMotion.matches;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function(slide, i) {
                slide.classList.toggle('is-active', i === current);
                slide.setAttribute('aria-hidden', String(i !== current));
            });
            status.textContent = (current + 1) + ' / ' + slides.length;
        }

        function sync() {
            window.clearInterval(timer);
            timer = null;
            pause.textContent = paused ? 'Play slideshow' : 'Pause slideshow';
            if (!paused && inView && !panel.hidden && !document.hidden && projects.classList.contains('active')) {
                // Start a new transition every four seconds; CSS supplies the 1.75s fade.
                timer = window.setInterval(function() { show(current + 1); }, 4000);
            }
        }

        element.classList.add('is-enhanced');
        show(0);
        element.querySelector('.project-carousel-controls').hidden = false;
        element.addEventListener('click', function(event) {
            var button = event.target.closest('[data-carousel-action]');
            if (!button) return;
            var action = button.getAttribute('data-carousel-action');
            if (action === 'pause') paused = !paused;
            else show(current + (action === 'next' ? 1 : -1));
            sync();
        });

        var observer = new IntersectionObserver(function(entries) {
            inView = entries[0].isIntersecting;
            sync();
        });
        observer.observe(element);

        reducedMotion.addEventListener('change', function(event) {
            if (event.matches) paused = true;
            sync();
        });
        carousels.push({ sync: sync });
    });

    document.addEventListener('visibilitychange', syncCarousels);
    new MutationObserver(syncCarousels).observe(projects, {
        attributes: true,
        attributeFilter: ['class']
    });
})();
