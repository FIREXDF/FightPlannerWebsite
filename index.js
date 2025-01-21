console.log('Script loading...');

document.body.style.overflow = 'hidden';

const loadingScreen = document.querySelector('.loading-screen');
const contentWrapper = document.querySelector('.content-wrapper');
let loadingTimeout;

const startLoadingAnimation = () => {
    clearTimeout(loadingTimeout);
    loadingScreen.classList.remove('hidden');
    contentWrapper.style.opacity = '0';
};

const hideLoadingScreen = () => {
    loadingScreen.classList.add('hidden');
    contentWrapper.classList.add('visible');
    initializeAnimations();
};

const initializeAnimations = () => {
    gsap.registerPlugin(ScrollTrigger, Flip);

    gsap.from('.site-logo', {
        duration: 1.5,
        y: -100,
        opacity: 0,
        rotation: -10,
        ease: 'elastic.out(1, 0.7)'
    });

    gsap.from('.landing-text p', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.5
    });

    gsap.from('.landing-image img', {
        opacity: 0,
        x: 100,
        duration: 1.5,
        delay: 0.5
    });

    initializeParallax();
    
    setTimeout(() => {
        initializeFeatureAnimations();
        initializeScreenshotViewer();
        initializeScrollAnimations();
    }, 1000);
};

window.addEventListener('load', () => {
    loadingTimeout = setTimeout(() => {
        hideLoadingScreen();
        document.body.style.overflow = 'visible';
    }, 2000);
});

const initializeParallax = () => {
    const landingSection = document.querySelector('.landing');
    const logo = document.querySelector('.site-logo');
    const landingText = document.querySelector('.landing-text');
    const landingImage = document.querySelector('.landing-image');

    landingSection.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = landingSection.getBoundingClientRect();
        
        const xPos = (clientX - left) / width - 0.5;
        const yPos = (clientY - top) / height - 0.5;

        gsap.to(landingText, {
            duration: 1,
            x: xPos * 30,
            y: yPos * 30,
            ease: 'power2.out'
        });

        gsap.to(landingImage, {
            duration: 1,
            x: -xPos * 50,
            y: -yPos * 50,
            rotateX: -yPos * 10,
            rotateY: xPos * 10,
            ease: 'power2.out'
        });

        gsap.to(logo, {
            duration: 1,
            x: xPos * 15,
            y: yPos * 15,
            ease: 'power2.out'
        });
    });

    landingSection.addEventListener('mouseleave', () => {
        gsap.to([landingText, logo], {
            duration: 1,
            x: 0,
            y: 0,
            ease: 'power2.out'
        });

        gsap.to(landingImage, {
            duration: 1,
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            ease: 'power2.out'
        });
    });
};

const initializeFeatureAnimations = () => {
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        const direction = index % 2 === 0 ? -50 : 50;
        
        gsap.fromTo(card, 
            { 
                x: direction,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: "top bottom-=100",
                    end: "top center",
                    toggleActions: "play none none none",
                    once: true,
                    markers: false
                }
            }
        );
    });
};

const initializeScreenshotViewer = () => {
    const viewer = document.querySelector('.screenshot-viewer');
    const viewerImg = viewer.querySelector('img');
    const prevBtn = viewer.querySelector('.nav-prev');
    const nextBtn = viewer.querySelector('.nav-next');
    const counter = viewer.querySelector('.screenshot-counter');
    const closeBtn = viewer.querySelector('.close-viewer');

    let currentImageIndex = 0;
    const screenshots = document.querySelectorAll('.screenshot-item img');
    const totalImages = screenshots.length;

    const updateScreenshot = (index) => {
        viewerImg.src = screenshots[index].src;
        counter.textContent = `${index + 1} / ${totalImages}`;
    };

    const showNextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % totalImages;
        updateScreenshot(currentImageIndex);
    };

    const showPrevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
        updateScreenshot(currentImageIndex);
    };

    screenshots.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentImageIndex = index;
            updateScreenshot(currentImageIndex);
            viewer.classList.add('active');
        });
    });

    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    document.addEventListener('keydown', (e) => {
        if (!viewer.classList.contains('active')) return;
        
        switch(e.key) {
            case 'ArrowRight':
                showNextImage();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'Escape':
                viewer.classList.remove('active');
                break;
        }
    });

    closeBtn.addEventListener('click', () => viewer.classList.remove('active'));
    viewer.addEventListener('click', (e) => {
        if (e.target === viewer) viewer.classList.remove('active');
    });
};

const initializeScrollAnimations = () => {
    document.querySelectorAll('.top-bar nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const topOffset = 100;
            
            const targetPosition = targetSection.offsetTop - topOffset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    document.querySelector('.cta-button').addEventListener('click', () => {
        const downloadSection = document.querySelector('#download');
        const topOffset = 100;
        
        const targetPosition = downloadSection.offsetTop - topOffset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });

    const updateActiveSection = () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelector(`.top-bar nav a[href="#${sectionId}"]`)?.classList.add('active');
            } else {
                document.querySelector(`.top-bar nav a[href="#${sectionId}"]`)?.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveSection);
    window.addEventListener('load', updateActiveSection);

    gsap.from('.download-card', {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '.download-options',
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.download-info', {
        opacity: 0,
        y: 30,
        duration: 1,
        scrollTrigger: {
            trigger: '.download-info',
            start: 'top bottom-=50',
            toggleActions: 'play none none reverse'
        }
    });
};

window.addEventListener('error', (e) => {
    console.error('Loading error:', e);
    hideLoadingScreen();
});

const videos = document.querySelectorAll('.feature-image video');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.play();
        } else {
            entry.target.pause();
        }
    });
}, { threshold: 0.5 });

videos.forEach(video => {
    observer.observe(video);
});

const cleanup = () => {
    if (activeImage) {
        closeLightbox();
    }
};

window.addEventListener('beforeunload', cleanup);

window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});

window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});

console.log('Animations setup complete');
