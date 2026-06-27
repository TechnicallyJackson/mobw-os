document.addEventListener('DOMContentLoaded', () => {
    const frame = document.getElementById('anim-frame');
    const headerText = document.querySelector('.header-text');
    const sideContent = document.querySelector('.scrolling-content');
    const navbar = document.querySelector('.navbar');

    // Force page to reset to the top on refresh if this animation exists
    if (frame && 'scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);
    }
    
    // Set dynamic nav height on load
    const updateNavHeight = () => {
        if (navbar) {
            document.body.style.setProperty('--nav-height', `${navbar.offsetHeight}px`);
        }
    };
    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);

    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY;
        const maxScroll = 600;
        let progress = Math.min(scrollY / maxScroll, 1);

        if (frame && navbar) {
            const navH = navbar.offsetHeight;
            const startW = window.innerWidth;
            const startH = window.innerHeight;
            
            const endW = Math.min(window.innerWidth * 0.9, 800);
            const endH = Math.max(window.innerHeight * 0.6, 400);
            
            const currentW = startW - ((startW - endW) * progress);
            const currentH = startH - ((startH - endH) * progress);
            
            frame.style.setProperty('--frame-width', `${currentW}px`);
            frame.style.setProperty('--frame-height', `${currentH}px`);

            frame.style.setProperty('--blob-blur', `${progress * 60}px`);
            frame.style.setProperty('--blob-radius', `${progress * 400}px`);
            frame.style.setProperty('--blob-opacity', progress);
            
            // Shadow peaks at 50% scroll then fades out as it becomes a blurred blob
            const shadowOp = 0.35 * Math.sin(progress * Math.PI);
            frame.style.setProperty('--shadow-opacity', shadowOp);
        }
        
        if (headerText) {
            // Fade out the main text faster so it's gone by 0.4
            let headerOpacity = 1 - (progress / 0.4);
            headerText.style.opacity = Math.max(0, headerOpacity);
        }
        
        const scrollArrow = document.getElementById('scroll-arrow');
        if (scrollArrow) {
            // Fade out the arrow very quickly so it's gone by 0.1
            let arrowOpacity = 1 - (progress / 0.1);
            scrollArrow.style.opacity = Math.max(0, arrowOpacity);
        }

        // --- NEW NAVBAR ANIMATION ---
        const logo = document.querySelector('.navbar-logo');
        const navIcons = document.querySelectorAll('.nav-icon');
        
        if (navbar && logo) {
            if (progress < 0.5) {
                // Completely hidden navbar and logo
                navbar.style.backgroundColor = `rgba(11, 17, 33, 0)`;
                navbar.style.boxShadow = `0 4px 15px rgba(0, 0, 0, 0)`;
                navIcons.forEach(icon => icon.style.opacity = 0);
                navIcons.forEach(icon => icon.style.pointerEvents = 'none');
                
                logo.style.opacity = 0;
            } else if (progress >= 0.5 && progress <= 0.8) {
                let navProgress = (progress - 0.5) / 0.3; // 0 to 1
                
                // Fast zoom effect using ease-out
                let easeProgress = 1 - Math.pow(1 - navProgress, 4); 
                
                // Delay the background fade until 0.6
                let bgProgress = Math.max(0, (progress - 0.6) / 0.2);
                navbar.style.backgroundColor = `rgba(11, 17, 33, ${bgProgress * 1})`;
                navbar.style.boxShadow = `0 4px 15px rgba(0, 0, 0, ${bgProgress * 0.3})`;
                navIcons.forEach(icon => icon.style.opacity = bgProgress);
                navIcons.forEach(icon => icon.style.pointerEvents = bgProgress > 0.8 ? 'auto' : 'none');
                
                const centerY = (window.innerHeight / 2) - (navbar.offsetHeight / 2);
                const currentY = centerY * (1 - easeProgress);
                const currentScale = 1 + (6 * (1 - easeProgress)); // From scale(7) down to scale(1)
                
                logo.style.transform = `translateX(-50%) translateY(${currentY}px) scale(${currentScale})`;
                
                // Fade in over the first 25% of the logo's animation
                let logoOpacity = 1;
                if (navProgress < 0.25) {
                    logoOpacity = navProgress / 0.25;
                }
                logo.style.opacity = logoOpacity;
                
                // Add a glow to the logo while it's zooming
                const glowBlur = 30 * (1 - easeProgress);
                logo.style.textShadow = `0 0 ${glowBlur}px rgba(56, 189, 248, ${1 - easeProgress})`;
            } else {
                navbar.style.backgroundColor = `rgba(11, 17, 33, 1)`;
                navbar.style.boxShadow = `0 4px 15px rgba(0, 0, 0, 0.3)`;
                navIcons.forEach(icon => icon.style.opacity = 1);
                navIcons.forEach(icon => icon.style.pointerEvents = 'auto');
                logo.style.transform = `translateX(-50%) translateY(0px) scale(1)`;
                logo.style.opacity = 1;
                logo.style.textShadow = 'none';
            }
        }

        if (sideContent) {
            let opacityProgress = 0;
            if (progress > 0.8) {
                opacityProgress = (progress - 0.8) / 0.2;
            }

            sideContent.style.opacity = opacityProgress;
            let yOffset = (1 - opacityProgress) * 50;
            sideContent.style.transform = `translateY(${yOffset}px)`;
        }
    });
    
    // Trigger scroll event once to apply initial layout states (like hiding the navbar)
    window.dispatchEvent(new Event('scroll'));
});
