// Sticker Scatter Effect
document.addEventListener("DOMContentLoaded", function() {
    const container = document.querySelector(".composition-container");
    const stickerElements = container.querySelectorAll("[id^='sticker-'], [id^='blue2'], [id^='broth'], [id^='lightblue'], [id^='one'], [id^='teal'], [id^='ten']");
    const stickers = Array.from(stickerElements);
    
    // Add sticker class to all elements for easier styling
    stickers.forEach(sticker => {
        sticker.classList.add("sticker");
        
        // Store original position for reset functionality
        const computedStyle = window.getComputedStyle(sticker);
        sticker.dataset.originalLeft = computedStyle.left;
        sticker.dataset.originalTop = computedStyle.top;
        sticker.dataset.originalZIndex = computedStyle.zIndex;
        
        // Add hover effect
        sticker.addEventListener("mouseenter", function() {
            this.style.zIndex = "1000";
            scatterNearbyStickers(this);
        });
        
        sticker.addEventListener("mouseleave", function() {
            this.style.zIndex = this.dataset.originalZIndex;
        });
        
        // Add click effect for individual stickers
        sticker.addEventListener("click", function(e) {
            e.stopPropagation();
            const randomAngle = Math.random() * Math.PI * 2;
            const randomDistance = 50 + Math.random() * 100;
            const moveX = Math.cos(randomAngle) * randomDistance;
            const moveY = Math.sin(randomAngle) * randomDistance;
            const rotation = (Math.random() - 0.5) * 60;
            
            this.style.transition = "transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28)";
            this.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotation}deg)`;
            
            setTimeout(() => {
                this.style.transition = "transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
                this.style.transform = "";
            }, 800);
        });
    });
    
    // Add CSS for transitions
    const style = document.createElement("style");
    style.textContent = `
        .sticker {
            transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                        z-index 0.3s ease;
            cursor: pointer;
        }
        
        .sticker:hover {
            transform: scale(1.15) rotate(2deg);
        }
        
        .sticker img {
            pointer-events: none;
        }
        
        .composition-container {
            cursor: crosshair;
        }
    `;
    document.head.appendChild(style);
    
    // Function to scatter nearby stickers
    function scatterNearbyStickers(centerSticker) {
        const rect = centerSticker.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2 - containerRect.left;
        const centerY = rect.top + rect.height / 2 - containerRect.top;
        
        stickers.forEach(sticker => {
            if (sticker !== centerSticker) {
                const stickerRect = sticker.getBoundingClientRect();
                const stickerX = stickerRect.left + stickerRect.width / 2 - containerRect.left;
                const stickerY = stickerRect.top + stickerRect.height / 2 - containerRect.top;
                
                // Calculate distance
                const dx = centerX - stickerX;
                const dy = centerY - stickerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Only scatter stickers within a certain radius
                if (distance < 150) {
                    // Calculate repulsion force (stronger for closer stickers)
                    const force = 1 - (distance / 150);
                    
                    // Direction away from center sticker
                    const angle = Math.atan2(dy, dx);
                    const moveX = -Math.cos(angle) * 70 * force;
                    const moveY = -Math.sin(angle) * 70 * force;
                    
                    // Add some randomness
                    const randomAngle = Math.random() * Math.PI * 2;
                    const randomX = Math.cos(randomAngle) * 15 * force;
                    const randomY = Math.sin(randomAngle) * 15 * force;
                    
                    // Apply transformation
                    sticker.style.transition = "transform 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)";
                    sticker.style.transform = `translate(${moveX + randomX}px, ${moveY + randomY}px) rotate(${(Math.random() - 0.5) * 20 * force}deg)`;
                    
                    // Reset after a delay
                    setTimeout(() => {
                        sticker.style.transition = "transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
                        sticker.style.transform = "";
                    }, 700 + Math.random() * 500);
                }
            }
        });
    }
    
    // Add click event to the container for explosion effect
    container.addEventListener("click", function(e) {
        if (e.target === container) {
            const containerRect = container.getBoundingClientRect();
            const clickX = e.clientX - containerRect.left;
            const clickY = e.clientY - containerRect.top;
            
            stickers.forEach(sticker => {
                const stickerRect = sticker.getBoundingClientRect();
                const stickerX = stickerRect.left - containerRect.left + stickerRect.width / 2;
                const stickerY = stickerRect.top - containerRect.top + stickerRect.height / 2;
                
                // Calculate vector from click to sticker
                const dx = stickerX - clickX;
                const dy = stickerY - clickY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Normalize direction
                const normalizedDx = dx / distance;
                const normalizedDy = dy / distance;
                
                // Scale factor based on distance (closer = stronger explosion)
                const maxDistance = Math.max(containerRect.width, containerRect.height);
                const distanceFactor = Math.max(0.3, Math.min(1, 1 - (distance / maxDistance)));
                
                // Calculate explosion force
                const explosionForce = 150 + Math.random() * 100;
                const moveX = normalizedDx * explosionForce * distanceFactor;
                const moveY = normalizedDy * explosionForce * distanceFactor;
                
                // Apply the explosion transformation
                sticker.style.transition = "transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1)";
                sticker.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${(Math.random() - 0.5) * 40}deg)`;
                
                // Reset after a delay
                setTimeout(() => {
                    sticker.style.transition = "transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
                    sticker.style.transform = "";
                }, 800 + Math.random() * 700);
            });
        }
    });
    
    // Add double-click to reset all stickers immediately
    container.addEventListener("dblclick", function() {
        stickers.forEach(sticker => {
            sticker.style.transition = "transform 0.5s ease-in-out";
            sticker.style.transform = "";
        });
    });
    
    // Add mousemove repulsion effect
    let throttled = false;
    container.addEventListener("mousemove", function(e) {
        if (!throttled) {
            throttled = true;
            setTimeout(() => { throttled = false; }, 80);
            
            const containerRect = container.getBoundingClientRect();
            const mouseX = e.clientX - containerRect.left;
            const mouseY = e.clientY - containerRect.top;
            
            stickers.forEach(sticker => {
                const stickerRect = sticker.getBoundingClientRect();
                const stickerX = stickerRect.left - containerRect.left + stickerRect.width / 2;
                const stickerY = stickerRect.top - containerRect.top + stickerRect.height / 2;
                
                const dx = stickerX - mouseX;
                const dy = stickerY - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Only affect nearby stickers
                if (distance < 50) {
                    // Subtle repulsion effect
                    const force = 1 - (distance / 50);
                    const moveX = dx * force * 0.2;
                    const moveY = dy * force * 0.2;
                    
                    sticker.style.transition = "transform 0.2s ease-out";
                    sticker.style.transform = `translate(${moveX}px, ${moveY}px)`;
                } else if (
                    sticker.style.transform && 
                    !sticker.style.transform.includes('rotate') &&
                    !sticker.style.transform.includes('scale')
                ) {
                    // Reset stickers that aren't part of another animation
                    sticker.style.transition = "transform 0.5s ease";
                    sticker.style.transform = "";
                }
            });
        }
    });
    
    // Function to handle window resize and keep proper scaling
    function handleResponsiveLayout() {
        // Get window dimensions
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Basic composition dimensions
        const compositionWidth = 800;
        const compositionHeight = 600;
        
        // Calculate the available space (with some padding)
        const availableWidth = windowWidth * 0.9;
        const availableHeight = windowHeight * 0.9;
        
        // Calculate scale factor based on available space
        let scaleX = availableWidth / compositionWidth;
        let scaleY = availableHeight / compositionHeight;
        
        // Use the smaller of the two scales to ensure the entire composition fits
        let scaleFactor = Math.min(scaleX, scaleY);
        
        // Make sure we don't scale up on large screens
        scaleFactor = Math.min(scaleFactor, 1);
        
        // Apply the scale transformation
        container.style.transform = `scale(${scaleFactor})`;
        
        // Adjust container's CSS properties for centering when scaled down
        if (scaleFactor < 1) {
            // The amount of size reduction in pixels
            const widthReduction = compositionWidth * (1 - scaleFactor);
            const heightReduction = compositionHeight * (1 - scaleFactor);
            
            // Apply negative margins to center the scaled container
            container.style.margin = `${-heightReduction/2}px ${-widthReduction/2}px`;
            // Add additional margin to center the whole container
            container.style.position = 'absolute';
            container.style.left = '50%';
            container.style.top = '50%';
            container.style.marginLeft = `-${compositionWidth * scaleFactor / 2}px`;
            container.style.marginTop = `-${compositionHeight * scaleFactor / 2}px`;
        } else {
            container.style.margin = '0 auto';
            container.style.position = 'relative';
            container.style.left = '0';
            container.style.top = '0';
            container.style.marginLeft = 'auto';
            container.style.marginRight = 'auto';
            container.style.marginTop = '20px';
        }
    }
    
    // Call once on load
    handleResponsiveLayout();
    
    // Call on window resize
    window.addEventListener('resize', handleResponsiveLayout);
});