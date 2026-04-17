/* ============================================
   BAHÍA CRISTAL — Interactive Scripts
   Particle system + Scroll animations
   ============================================ */

(function () {
    'use strict';

    // --- Particle System ---
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
            this.fadeSpeed = Math.random() * 0.003 + 0.001;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity += this.fadeDirection * this.fadeSpeed;

            if (this.opacity >= 0.5) this.fadeDirection = -1;
            if (this.opacity <= 0.05) this.fadeDirection = 1;

            if (this.x < -10 || this.x > canvas.width + 10 ||
                this.y < -10 || this.y > canvas.height + 10) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        resizeCanvas();
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        const maxDist = 120;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const opacity = (1 - dist / maxDist) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(43, 143, 212, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        animationId = requestAnimationFrame(animate);
    }

    // --- Intersection Observer for scroll animations ---
    function setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.header, .video-section, .footer').forEach(el => {
            observer.observe(el);
        });
    }

    // --- Parallax on mouse move (subtle) ---
    function setupParallax() {
        const elements = document.querySelectorAll('.blueprint-circle, .compass-rose');
        
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            elements.forEach((el, i) => {
                const factor = (i + 1) * 5;
                el.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        });
    }

    // --- Video frame glow on hover ---
    function setupVideoGlow() {
        const frame = document.querySelector('.video-frame');
        if (!frame) return;

        frame.addEventListener('mouseenter', () => {
            frame.style.boxShadow = '0 0 60px rgba(0, 212, 255, 0.15), 0 20px 80px rgba(0, 0, 0, 0.4)';
        });

        frame.addEventListener('mouseleave', () => {
            frame.style.boxShadow = 'none';
        });
    }

    // --- Smooth reveal on load ---
    function revealPage() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.8s ease';
        
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    }

    // --- Init ---
    window.addEventListener('load', () => {
        revealPage();
        initParticles();
        animate();
        setupScrollAnimations();
        setupParallax();
        setupVideoGlow();
    });

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        initParticles();
        animate();
    });

    // Reduce particle animation when tab not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });

})();
