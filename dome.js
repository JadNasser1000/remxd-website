// Vanilla JS implementation of DomeGallery (converted from React component)
document.addEventListener("DOMContentLoaded", function() {
    const DEFAULTS = {
        maxVerticalRotationDeg: 0, // Disabled vertical rotation
        dragSensitivity: 15, // Increased sensitivity for 1:1 drag-to-rotation ratio
        enlargeTransitionMs: 300,
        segments: 35
    };

    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
    const normalizeAngle = d => ((d % 360) + 360) % 360;
    const wrapAngleSigned = deg => {
        const a = (((deg + 180) % 360) + 360) % 360;
        return a - 180;
    };

    const getDataNumber = (el, name, fallback) => {
        const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
        const n = attr == null ? NaN : parseFloat(attr);
        return Number.isFinite(n) ? n : fallback;
    };

    function buildItems(pool, seg) {
        const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
        const evenYs = [-4, -2, 0, 2, 4];
        const oddYs = [-3, -1, 1, 3, 5];

        const coords = xCols.flatMap((x, c) => {
            const ys = c % 2 === 0 ? evenYs : oddYs;
            return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
        });

        const totalSlots = coords.length;
        if (pool.length === 0) {
            return coords.map(c => ({ ...c, src: '', alt: '' }));
        }
        const normalizedImages = pool.map(image => {
            if (typeof image === 'string') {
                return { src: image, alt: '' };
            }
            return { src: image.src || '', alt: image.alt || '' };
        });
        const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length]);
        for (let i = 1; i < usedImages.length; i++) {
            if (usedImages[i].src === usedImages[i - 1].src) {
                for (let j = i + 1; j < usedImages.length; j++) {
                    if (usedImages[j].src !== usedImages[i].src) {
                        const tmp = usedImages[i];
                        usedImages[i] = usedImages[j];
                        usedImages[j] = tmp;
                        break;
                    }
                }
            }
        }
        return coords.map((c, i) => ({
            ...c,
            src: usedImages[i].src,
            alt: usedImages[i].alt
        }));
    }

    function computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments) {
        const unit = 360 / segments / 2;
        const rotateY = unit * (offsetX + (sizeX - 1) / 2);
        const rotateX = unit * (offsetY - (sizeY - 1) / 2);
        return { rotateX, rotateY };
    }

    // REMXD dome images
    const IMAGES = [
        "Remxd-dome/Dome-1.jpeg",
        "Remxd-dome/Dome-2.png",
        "Remxd-dome/Dome-3.jpeg",
        "Remxd-dome/Dome-4.jpeg",
        "Remxd-dome/Dome-5.jpeg",
        "Remxd-dome/Dome-6.jpeg",
        "Remxd-dome/Dome-7.jpeg",
        "Remxd-dome/Dome-8.jpg",
        "Remxd-dome/Dome-9.JPG",
        "Remxd-dome/Dome-10.png",
        "Remxd-dome/Dome-11.PNG"
    ];

    const images = IMAGES.map(src => ({ src, alt: '' }));
    const segments = DEFAULTS.segments;
    const items = buildItems(images, segments);

    // Get or create dome container
    let rootEl = document.getElementById('dome-background');
    if (!rootEl) {
        rootEl = document.createElement('div');
        rootEl.id = 'dome-background';
        rootEl.className = 'sphere-root';
        document.body.insertBefore(rootEl, document.body.firstChild);
    }
    rootEl.className = 'sphere-root';

    // Create main structure
    const mainEl = document.createElement('main');
    mainEl.className = 'sphere-main';
    
    const stageEl = document.createElement('div');
    stageEl.className = 'stage';
    
    const sphereEl = document.createElement('div');
    sphereEl.className = 'sphere';
    
    // Create items
    items.forEach((it, i) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'item';
        itemEl.dataset.src = it.src;
        itemEl.dataset.offsetX = it.x;
        itemEl.dataset.offsetY = it.y;
        itemEl.dataset.sizeX = it.sizeX;
        itemEl.dataset.sizeY = it.sizeY;
        itemEl.style.setProperty('--offset-x', it.x);
        itemEl.style.setProperty('--offset-y', it.y);
        itemEl.style.setProperty('--item-size-x', it.sizeX);
        itemEl.style.setProperty('--item-size-y', it.sizeY);
        
        const imageEl = document.createElement('div');
        imageEl.className = 'item__image';
        imageEl.setAttribute('role', 'button');
        imageEl.setAttribute('tabindex', '0');
        imageEl.setAttribute('aria-label', it.alt || 'Open image');
        
        const img = document.createElement('img');
        img.src = it.src;
        img.draggable = false;
        img.alt = it.alt;
        
        imageEl.appendChild(img);
        itemEl.appendChild(imageEl);
        sphereEl.appendChild(itemEl);
    });
    
    stageEl.appendChild(sphereEl);
    mainEl.appendChild(stageEl);
    
    // Add overlays
    const overlay1 = document.createElement('div');
    overlay1.className = 'overlay';
    mainEl.appendChild(overlay1);
    
    const overlay2 = document.createElement('div');
    overlay2.className = 'overlay overlay--blur';
    mainEl.appendChild(overlay2);
    
    const edgeFadeTop = document.createElement('div');
    edgeFadeTop.className = 'edge-fade edge-fade--top';
    mainEl.appendChild(edgeFadeTop);
    
    const edgeFadeBottom = document.createElement('div');
    edgeFadeBottom.className = 'edge-fade edge-fade--bottom';
    mainEl.appendChild(edgeFadeBottom);
    
    // Viewer (for enlarged images - simplified for now)
    const viewerEl = document.createElement('div');
    viewerEl.className = 'viewer';
    const scrimEl = document.createElement('div');
    scrimEl.className = 'scrim';
    const frameEl = document.createElement('div');
    frameEl.className = 'frame';
    viewerEl.appendChild(scrimEl);
    viewerEl.appendChild(frameEl);
    mainEl.appendChild(viewerEl);
    
    rootEl.appendChild(mainEl);
    
    // Set CSS variables
    rootEl.style.setProperty('--segments-x', segments);
    rootEl.style.setProperty('--segments-y', segments);
    rootEl.style.setProperty('--overlay-blur-color', '#060010');
    rootEl.style.setProperty('--tile-radius', '30px');
    rootEl.style.setProperty('--enlarge-radius', '30px');
    rootEl.style.setProperty('--image-filter', 'none'); // Changed from grayscale(1) to none for full color
    
    // Rotation state
    const rotationRef = { x: 0, y: 0 };
    let startRotRef = { x: 0, y: 0 };
    let startPosRef = null;
    let draggingRef = false;
    let movedRef = false;
    let inertiaRAF = null;
    let autoRotateRAF = null;
    let autoRotateActive = true;
    let autoRotateTimeout = null;
    const AUTO_ROTATE_SPEED = 0.04; // Degrees per frame - adjust for speed (0.05 = very slow, 0.1 = slow, 0.2 = fast)
    
    const applyTransform = (xDeg, yDeg) => {
        sphereEl.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    };
    
    // ResizeObserver for radius calculation
    const lockedRadiusRef = { current: null };
    const ro = new ResizeObserver(entries => {
        const cr = entries[0].contentRect;
        const w = Math.max(1, cr.width);
        const h = Math.max(1, cr.height);
        const minDim = Math.min(w, h);
        const maxDim = Math.max(w, h);
        const aspect = w / h;
        const basis = aspect >= 1.3 ? w : minDim;
        let radius = basis * 0.65; // Increased from 0.5 to 0.65 for larger images
        const heightGuard = h * 1.35;
        radius = Math.min(radius, heightGuard);
        radius = clamp(radius, 700, Infinity); // Increased minimum from 600 to 700
        lockedRadiusRef.current = Math.round(radius);
        const viewerPad = Math.max(8, Math.round(minDim * 0.25));
        rootEl.style.setProperty('--radius', `${lockedRadiusRef.current}px`);
        rootEl.style.setProperty('--viewer-pad', `${viewerPad}px`);
        applyTransform(rotationRef.x, rotationRef.y);
    });
    ro.observe(rootEl);
    
    // Drag handling
    const stopInertia = () => {
        if (inertiaRAF) {
            cancelAnimationFrame(inertiaRAF);
            inertiaRAF = null;
        }
    };
    
    const stopAutoRotate = () => {
        if (autoRotateRAF) {
            cancelAnimationFrame(autoRotateRAF);
            autoRotateRAF = null;
        }
        if (autoRotateTimeout) {
            clearTimeout(autoRotateTimeout);
            autoRotateTimeout = null;
        }
    };
    
    const startAutoRotate = () => {
        stopAutoRotate();
        stopInertia();
        const step = () => {
            if (!draggingRef && autoRotateActive) {
                rotationRef.y = wrapAngleSigned(rotationRef.y + AUTO_ROTATE_SPEED);
                applyTransform(0, rotationRef.y);
                autoRotateRAF = requestAnimationFrame(step);
            } else {
                autoRotateRAF = null;
            }
        };
        autoRotateRAF = requestAnimationFrame(step);
    };
    
    const startInertia = (vx, vy) => {
        const MAX_V = 2.5; // Increased max velocity for faster spins
        let vX = clamp(vx, -MAX_V, MAX_V) * 120; // Increased multiplier for longer spin
        let vY = 0; // Disabled vertical inertia
        let frames = 0;
        const frictionMul = 0.992; // Much lower friction for very long spins
        const stopThreshold = 0.001; // Even lower threshold so it spins much longer
        const maxFrames = 1200; // Doubled max frames for very long duration
        const step = () => {
            vX *= frictionMul;
            if (Math.abs(vX) < stopThreshold) {
                inertiaRAF = null;
                // Resume auto-rotation after inertia stops
                setTimeout(() => {
                    if (!draggingRef) {
                        autoRotateActive = true;
                        startAutoRotate();
                    }
                }, 500);
                return;
            }
            if (++frames > maxFrames) {
                inertiaRAF = null;
                // Resume auto-rotation after inertia stops
                setTimeout(() => {
                    if (!draggingRef) {
                        autoRotateActive = true;
                        startAutoRotate();
                    }
                }, 500);
                return;
            }
            const nextY = wrapAngleSigned(rotationRef.y + vX / 200);
            rotationRef.y = nextY;
            applyTransform(0, nextY); // Always use 0 for X rotation
            inertiaRAF = requestAnimationFrame(step);
        };
        stopInertia();
        stopAutoRotate();
        autoRotateActive = false;
        inertiaRAF = requestAnimationFrame(step);
    };
    
    // Mouse events
    mainEl.addEventListener('mousedown', (e) => {
        stopInertia();
        stopAutoRotate();
        autoRotateActive = false;
        draggingRef = true;
        movedRef = false;
        startRotRef = { ...rotationRef };
        startPosRef = { x: e.clientX, y: e.clientY };
    });
    
    mainEl.addEventListener('mousemove', (e) => {
        if (!draggingRef || !startPosRef) return;
        const dxTotal = e.clientX - startPosRef.x;
        if (!movedRef) {
            const dist2 = dxTotal * dxTotal;
            if (dist2 > 16) movedRef = true;
        }
        // Only horizontal rotation with improved sensitivity
        const nextY = wrapAngleSigned(startRotRef.y + dxTotal / DEFAULTS.dragSensitivity);
        rotationRef.y = nextY;
        applyTransform(0, nextY); // Always use 0 for X rotation
    });
    
    mainEl.addEventListener('mouseup', (e) => {
        // Check startPosRef instead of draggingRef to handle case where mouseleave
        // set draggingRef to false but drag was still in progress
        if (!startPosRef) return;
        
        draggingRef = false;
        // Cancel any pending auto-rotate timeout from mouseleave
        stopAutoRotate();
        
        if (movedRef) {
            const dx = e.clientX - startPosRef.x;
            // Only horizontal velocity, increased for longer spin
            const vx = clamp((dx / DEFAULTS.dragSensitivity) * 0.04, -2.0, 2.0);
            if (Math.abs(vx) > 0.005) {
                startInertia(vx, 0);
            } else {
                // Resume auto-rotation after a short delay if no inertia
                autoRotateTimeout = setTimeout(() => {
                    if (!draggingRef && !inertiaRAF) {
                        autoRotateActive = true;
                        startAutoRotate();
                    }
                }, 500);
            }
        } else {
            // Resume auto-rotation if user clicked but didn't drag
            autoRotateTimeout = setTimeout(() => {
                if (!draggingRef && !inertiaRAF) {
                    autoRotateActive = true;
                    startAutoRotate();
                }
            }, 500);
        }
        movedRef = false;
        startPosRef = null; // Clear startPosRef after handling mouseup
    });
    
    mainEl.addEventListener('mouseleave', () => {
        if (draggingRef && startPosRef) {
            // Set draggingRef = false to stop mousemove updates, but keep startPosRef
            // so mouseup can still calculate inertia even if mouse left the element
            draggingRef = false;
            // Schedule auto-rotate, but mouseup will cancel it if inertia starts
            autoRotateTimeout = setTimeout(() => {
                // Clear startPosRef if mouseup never fired (mouse released outside)
                if (startPosRef) {
                    startPosRef = null;
                }
                if (!draggingRef && !inertiaRAF) {
                    autoRotateActive = true;
                    startAutoRotate();
                }
            }, 500);
        }
    });
    
    // Touch events
    mainEl.addEventListener('touchstart', (e) => {
        e.preventDefault();
        stopInertia();
        stopAutoRotate();
        autoRotateActive = false;
        draggingRef = true;
        movedRef = false;
        startRotRef = { ...rotationRef };
        startPosRef = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });
    
    mainEl.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!draggingRef || !startPosRef) return;
        const dxTotal = e.touches[0].clientX - startPosRef.x;
        if (!movedRef) {
            const dist2 = dxTotal * dxTotal;
            if (dist2 > 16) movedRef = true;
        }
        // Only horizontal rotation with improved sensitivity
        const nextY = wrapAngleSigned(startRotRef.y + dxTotal / DEFAULTS.dragSensitivity);
        rotationRef.y = nextY;
        applyTransform(0, nextY); // Always use 0 for X rotation
    });
    
    mainEl.addEventListener('touchend', (e) => {
        // Check startPosRef instead of draggingRef for consistency with mouseup fix
        if (!startPosRef) return;
        
        draggingRef = false;
        // Cancel any pending auto-rotate timeout
        stopAutoRotate();
        
        if (movedRef) {
            const touch = e.changedTouches[0];
            const dx = touch.clientX - startPosRef.x;
            // Only horizontal velocity, increased for longer spin
            const vx = clamp((dx / DEFAULTS.dragSensitivity) * 0.04, -2.0, 2.0);
            if (Math.abs(vx) > 0.005) {
                startInertia(vx, 0);
            } else {
                // Resume auto-rotation after a short delay if no inertia
                autoRotateTimeout = setTimeout(() => {
                    if (!draggingRef && !inertiaRAF) {
                        autoRotateActive = true;
                        startAutoRotate();
                    }
                }, 500);
            }
        } else {
            // Resume auto-rotation if user tapped but didn't drag
            autoRotateTimeout = setTimeout(() => {
                if (!draggingRef && !inertiaRAF) {
                    autoRotateActive = true;
                    startAutoRotate();
                }
            }, 500);
        }
        movedRef = false;
        startPosRef = null; // Clear startPosRef after handling touchend
    });
    
    // Initial transform
    applyTransform(0, 0);
    
    // Start auto-rotation after a short delay
    setTimeout(() => {
        startAutoRotate();
    }, 1000);
});