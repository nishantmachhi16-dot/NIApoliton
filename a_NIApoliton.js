// app.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation & Activity Interaction ---
    // Handling the notification badge and project interaction buttons.
    const cartBadge = document.getElementById('cart-badge');
    const projectButtons = document.querySelectorAll('.project-action-btn');

    let badgeCount = 0;

    projectButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default action

            // Trigger a brief pulsing animation on the notification badge
            cartBadge.classList.add('scale-125', 'bg-prism-lime', 'text-prism-btn');
            cartBadge.classList.remove('bg-white', 'text-prism-text');
            setTimeout(() => {
                cartBadge.classList.remove('scale-125', 'bg-prism-lime', 'text-prism-btn');
                cartBadge.classList.add('bg-white', 'text-prism-text');
            }, 300);

            // Simple animation for the button
            const originalContent = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i><span>Loading the List!</span>';

            // Update button styles
            button.classList.add('bg-prism-lime', 'text-prism-btn');
            button.classList.remove('bg-prism-btn', 'text-white');

            // Revert button back after a short delay
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.classList.remove('bg-prism-lime', 'text-prism-btn');
                button.classList.add('bg-prism-btn', 'text-white');
            }, 1500);
        });
    });

    // --- Header Navigation Interaction ---
    // Toggles the mobile menu icon between bars and close state.
    const menuToggle = document.getElementById('nav-menu');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const icon = menuToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- Shatter Canvas Scrollytelling ---
    const canvas = document.getElementById('shatter-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d', { alpha: false });
        const FRAME_COUNT = 224;
        const images = [];
        let loadedFrames = 0;

        const preloader = document.getElementById('shatter-preloader');
        const progressBar = document.getElementById('shatter-progress-bar');
        const progressText = document.getElementById('shatter-progress-text');
        const textContainer = document.getElementById('shatter-text-container');
        const heroSection = document.getElementById('shatter-hero');

        // Content Phase Containers (Targeted by Scroll Progress)
        const phaseIntro = document.getElementById('niapoliton-intro');
        const phaseResilience = document.getElementById('resilience-info');
        const phaseIsomorphism = document.getElementById('isomorphism-info');
        const phaseCollapse = document.getElementById('collapse-info');

        // Preload Images
        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            const frameNum = i.toString().padStart(4, '0');
            img.src = `frames/${frameNum}.jpg`;

            img.onload = () => {
                loadedFrames++;
                const percent = Math.round((loadedFrames / FRAME_COUNT) * 100);
                if (progressBar) progressBar.style.width = `${percent}%`;
                if (progressText) progressText.textContent = `${percent}%`;

                if (loadedFrames === FRAME_COUNT) {
                    initCanvas();
                }
            };
            images.push(img);
        }

        let currentProgress = 0;
        let targetProgress = 0;
        let animationFrameId;

        function initCanvas() {
            // Hide preloader and show text container
            if (preloader) {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    if (textContainer) textContainer.classList.remove('hidden');
                }, 500);
            }

            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            window.addEventListener('scroll', onScroll, { passive: true });

            // Start render loop
            renderLoop();
        }

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawFrame(currentProgress);
        }

        function onScroll() {
            const rect = heroSection.getBoundingClientRect();
            // Calculate how far we've scrolled through the hero section (0 to 1)
            // rect.top goes from 0 (at top) to -(rect.height - window.innerHeight) (at bottom)
            const maxScroll = rect.height - window.innerHeight;
            let progress = -rect.top / maxScroll;

            // Clamp between 0 and 1
            progress = Math.max(0, Math.min(1, progress));
            targetProgress = progress;
        }

        // Interpolate function for mapping scroll % to output domains
        function interpolate(value, inMin, inMax, outMin, outMax) {
            if (value <= inMin) return outMin;
            if (value >= inMax) return outMax;
            return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
        }

        /**
         * updates visibility and position of text elements based on current scroll position.
         */
        function updateBeats(progress) {
            // Intro: NIApoliton (Active between 0-20% scroll)
            if (phaseIntro) {
                const opA = interpolate(progress, 0, 0.05, 0, 1) * interpolate(progress, 0.15, 0.2, 1, 0);
                const yA = interpolate(progress, 0, 0.05, 20, 0) - interpolate(progress, 0.15, 0.2, 0, 20);
                phaseIntro.style.opacity = opA;
                phaseIntro.style.transform = `translateY(${yA}px)`;

                // Re-trigger the 'shatter' CSS animation if in view
                if (progress > 0 && progress < 0.2) {
                    phaseIntro.classList.add('active');
                } else {
                    phaseIntro.classList.remove('active');
                }
            }

            // Phase: RESILIENCE (Active between 25-50% scroll)
            if (phaseResilience) {
                const opB = interpolate(progress, 0.25, 0.3, 0, 1) * interpolate(progress, 0.45, 0.5, 1, 0);
                const yB = interpolate(progress, 0.25, 0.3, 20, 0) - interpolate(progress, 0.45, 0.5, 0, 20);
                phaseResilience.style.opacity = opB;
                phaseResilience.style.transform = `translateY(${yB}px)`;
            }

            // Phase: ISOMORPHISM (Active between 55-80% scroll)
            if (phaseIsomorphism) {
                const opC = interpolate(progress, 0.55, 0.6, 0, 1) * interpolate(progress, 0.75, 0.8, 1, 0);
                const yC = interpolate(progress, 0.55, 0.6, 20, 0) - interpolate(progress, 0.75, 0.8, 0, 20);
                phaseIsomorphism.style.opacity = opC;
                phaseIsomorphism.style.transform = `translateY(${yC}px)`;
            }

            // Phase: Collapse / Final CTA (Active between 85-100% scroll)
            if (phaseCollapse) {
                const opD = interpolate(progress, 0.85, 0.9, 0, 1);
                const yD = interpolate(progress, 0.85, 0.9, 20, 0);
                phaseCollapse.style.opacity = opD;
                phaseCollapse.style.transform = `translateY(${yD}px)`;

                // Enable interactivity for buttons only when visible
                if (progress > 0.85) {
                    phaseCollapse.style.pointerEvents = 'auto';
                } else {
                    phaseCollapse.style.pointerEvents = 'none';
                }
            }
        }

        function drawFrame(progress) {
            let frameIndex = Math.floor(progress * (FRAME_COUNT - 1));
            frameIndex = Math.max(0, Math.min(FRAME_COUNT - 1, frameIndex));

            const img = images[frameIndex];
            if (!img || !img.complete) return;

            const ctxWidth = canvas.width;
            const ctxHeight = canvas.height;
            const imgRatio = img.width / img.height;
            const ctxRatio = ctxWidth / ctxHeight;

            let drawWidth, drawHeight, offsetX, offsetY;

            // object-cover logic
            if (imgRatio > ctxRatio) {
                drawHeight = ctxHeight;
                drawWidth = img.width * (ctxHeight / img.height);
                offsetX = (ctxWidth - drawWidth) / 2;
                offsetY = 0;
            } else {
                drawWidth = ctxWidth;
                drawHeight = img.height * (ctxWidth / img.width);
                offsetX = 0;
                offsetY = (ctxHeight - drawHeight) / 2;
            }

            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, ctxWidth, ctxHeight);
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }

        /**
         * The standard render loop that applies easing to the scroll progress calculation.
         */
        function renderLoop() {
            // Standard easing algorithm (10% per frame)
            currentProgress += (targetProgress - currentProgress) * 0.1;

            // Redraw only if there's a visible change
            if (Math.abs(targetProgress - currentProgress) > 0.0001) {
                drawFrame(currentProgress);
                updateBeats(currentProgress);
            }

            animationFrameId = requestAnimationFrame(renderLoop);
        }
    }



        // Menu Toggle Logic
        const navMenuBtn = document.getElementById('nav-menu');
        const sideMenuPanel = document.getElementById('side-menu-panel');
        const menuOverlay = document.getElementById('menu-overlay');
        const closeMenuBtn = document.getElementById('close-menu');

        const toggleMenu = () => {
            sideMenuPanel.classList.toggle('open');
            menuOverlay.classList.toggle('active');
            document.body.style.overflow = sideMenuPanel.classList.contains('open') ? 'hidden' : '';
        };

        const closeMenu = () => {
            sideMenuPanel.classList.remove('open');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
            // Close all flyouts
            document.querySelectorAll('.menu-item').forEach(item => {
                item.classList.remove('active-submenu');
            });
        };

        navMenuBtn.onclick = (e) => {
            e.stopPropagation();
            toggleMenu();
        };

        closeMenuBtn.onclick = closeMenu;
        menuOverlay.onclick = closeMenu;

        // Escape key to close
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });

        // Hover Submenu Logic
        const menuItems = document.querySelectorAll('.menu-item');

        menuItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                // Remove active from others first to prevent overlapping submenus
                menuItems.forEach(other => other.classList.remove('active-submenu'));
                item.classList.add('active-submenu');
            });

            item.addEventListener('mouseleave', () => {
                item.classList.remove('active-submenu');
            });
        });

        // Prevent panel clicks from closing
        sideMenuPanel.onclick = (e) => e.stopPropagation();

});

