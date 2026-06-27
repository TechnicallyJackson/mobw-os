document.addEventListener('DOMContentLoaded', () => {
    let currentFocused = null;
    let isAnimatingIntro = false;

    function slowScrollIntro(targetY, duration) {
        if (isAnimatingIntro) return;
        isAnimatingIntro = true;
        
        const startY = window.scrollY;
        const diff = targetY - startY;
        const startTime = performance.now();
        
        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // easeInOutCubic for a smooth cinematic feel
            const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startY + (diff * ease));
            
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                isAnimatingIntro = false;
                // Once done, focus the first card automatically!
                const elements = getFocusableElements();
                const firstCard = elements.find(el => el.classList.contains('content-section'));
                if (firstCard) {
                    setFocus(firstCard);
                } else if (elements.length > 0) {
                    setFocus(elements[0]);
                }
            }
        }
        requestAnimationFrame(step);
    }

    function getFocusableElements() {
        return Array.from(document.querySelectorAll('.focusable')).filter(el => {
            let parent = el;
            while (parent && parent !== document.body) {
                const style = window.getComputedStyle(parent);
                if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0' || style.pointerEvents === 'none') {
                    return false;
                }
                if (parseFloat(style.opacity) < 0.1) {
                    return false;
                }
                parent = parent.parentElement;
            }
            
            const rect = el.getBoundingClientRect();
            // Ignore elements hidden horizontally (e.g. closed side menus that are translated offscreen)
            if (rect.right <= 0 || rect.left >= window.innerWidth) return false;

            return true;
        });
    }

    function setFocus(el) {
        if (currentFocused) {
            currentFocused.classList.remove('focused');
        }
        currentFocused = el;
        if (currentFocused) {
            currentFocused.classList.add('focused');
            
            // Do not try to scroll sticky/fixed elements (like the navbar icons or side menu contents) into view
            const isStickyOrFixed = currentFocused.classList.contains('nav-icon') || 
                                    currentFocused.closest('.navbar') || 
                                    currentFocused.closest('.side-menu');
            
            if (!isStickyOrFixed) {
                // Scroll into view if offscreen
                const rect = currentFocused.getBoundingClientRect();
                const navH = 80; // approximate navbar height padding
                
                if (rect.top < navH) {
                    window.scrollBy({ top: rect.top - navH - 20, behavior: 'smooth' });
                } else if (rect.bottom > window.innerHeight) {
                    window.scrollBy({ top: rect.bottom - window.innerHeight + 20, behavior: 'smooth' });
                }
            }
        }
    }

    function getDistance(rect1, rect2, direction) {
        let dx = 0;
        let dy = 0;
        
        const c1 = { x: rect1.left + rect1.width/2, y: rect1.top + rect1.height/2 };
        const c2 = { x: rect2.left + rect2.width/2, y: rect2.top + rect2.height/2 };

        if (direction === 'ArrowUp') {
            if (c2.y >= c1.y - 10) return Infinity; // 10px tolerance for same-row
            dy = c1.y - c2.y;
            dx = Math.abs(c1.x - c2.x) * 2; // Penalize horizontal drift
        } else if (direction === 'ArrowDown') {
            if (c2.y <= c1.y + 10) return Infinity;
            dy = c2.y - c1.y;
            dx = Math.abs(c1.x - c2.x) * 2;
        } else if (direction === 'ArrowLeft') {
            if (c2.x >= c1.x - 10) return Infinity;
            dx = c1.x - c2.x;
            dy = Math.abs(c1.y - c2.y) * 2;
        } else if (direction === 'ArrowRight') {
            if (c2.x <= c1.x + 10) return Infinity;
            dx = c2.x - c1.x;
            dy = Math.abs(c1.y - c2.y) * 2;
        }
        
        return (dx * dx) + (dy * dy); 
    }

    window.addEventListener('keydown', (e) => {
        const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'];
        if (!keys.includes(e.key)) return;
        
        e.preventDefault();

        if (e.key === 'Enter') {
            if (currentFocused) {
                currentFocused.click();
            }
            return;
        }

        const elements = getFocusableElements();
        
        // If no elements are visible (e.g., during the cinematic intro), just scroll physically
        if (elements.length === 0) {
            if (e.key === 'ArrowDown') slowScrollIntro(600, 2500); // 2.5 second cinematic scroll to maxScroll
            return;
        }

        // If no element is currently focused, or the focused element became hidden (menu closed)
        if (!currentFocused || !elements.includes(currentFocused)) {
            // Pick the first valid element (closest to top-left)
            let best = elements[0];
            let minDist = Infinity;
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const dist = (rect.top * rect.top) + (rect.left * rect.left);
                if (dist < minDist) {
                    minDist = dist;
                    best = el;
                }
            });
            setFocus(best);
            return;
        }

        // Find the best match in the direction pressed
        const currentRect = currentFocused.getBoundingClientRect();
        let bestMatch = null;
        let minScore = Infinity;

        elements.forEach(el => {
            if (el === currentFocused) return;
            const rect = el.getBoundingClientRect();
            const score = getDistance(currentRect, rect, e.key);
            if (score < minScore) {
                minScore = score;
                bestMatch = el;
            }
        });

        if (bestMatch) {
            setFocus(bestMatch);
        } else {
            // Reached the edge of navigable elements.
            if (e.key === 'ArrowDown') {
                window.scrollBy({ top: 200, behavior: 'smooth' });
            }
            // Intentionally removed ArrowUp fallback so the user cannot scroll back up past the top element into the intro.
        }
    });
});
