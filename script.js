document.addEventListener('DOMContentLoaded', function() {
    // Fichier pour le JavaScript futur du site du District Olave
    console.log("Le site du District Olave est prêt !");

    const hero = document.getElementById('hero');
    if (hero) {
        const images = [
            'https://images.pexels.com/photos/302804/pexels-photo-302804.jpeg',
            'https://images.pexels.com/photos/264917/pexels-photo-264917.jpeg',
            'https://images.pexels.com/photos/691034/pexels-photo-691034.jpeg'
        ];
        let currentImageIndex = 0;

        function changeBackgroundImage() {
            const nextImageIndex = (currentImageIndex + 1) % images.length;
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = images[nextImageIndex];
            document.head.appendChild(preloadLink);

            hero.style.backgroundImage = `url('${images[currentImageIndex]}')`;
            currentImageIndex = nextImageIndex;
            
            setTimeout(() => document.head.removeChild(preloadLink), 2000);
        }

        changeBackgroundImage();
        setInterval(changeBackgroundImage, 5000);
    }

    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const accordionContent = header.nextElementSibling;

            document.querySelectorAll('.accordion-header.active').forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.classList.remove('active');
                    otherHeader.nextElementSibling.style.maxHeight = null;
                }
            });

            header.classList.toggle('active');

            if (accordionContent.style.maxHeight) {
                accordionContent.style.maxHeight = null;
            } else {
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
            }
        });
    });

    // Image Slider on homepage
    const slider = document.querySelector('.slider');
    if (slider) {
        const slides = document.querySelectorAll('.slide');
        const nextBtn = document.querySelector('.next');
        const prevBtn = document.querySelector('.prev');
        let currentSlide = 0;

        function showSlide(n) {
            slides.forEach((slide, index) => {
                slide.classList.remove('active');
                if (index === n) {
                    slide.classList.add('active');
                }
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        if (slides.length > 0) {
            showSlide(currentSlide);
            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', prevSlide);
            setInterval(nextSlide, 7000);
        }
    }

    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
    });

    // Animated Counters
    const countersSection = document.getElementById('denombrement');
    if (countersSection) {
        const counters = document.querySelectorAll('.counter');
        const speed = 200;

        const animateCounters = () => {
            counters.forEach(counter => {
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const increment = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + increment);
                        setTimeout(updateCount, 10);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(countersSection);
    }

    // Tabbed Content for multi-section pages
    const handleTabbedContent = () => {
        const pageNav = document.querySelector('.page-nav');
        if (!pageNav) return;

        const sections = document.querySelectorAll('.main-section');
        const navItems = document.querySelectorAll('.page-nav-item');

        function showSection(hash) {
            let targetHash = hash;
            if (!targetHash && navItems.length > 0) {
                targetHash = navItems[0].getAttribute('href');
            }

            sections.forEach(section => {
                if ('#' + section.id === targetHash) {
                    section.classList.add('visible');
                } else {
                    section.classList.remove('visible');
                }
            });

            navItems.forEach(item => {
                if (item.getAttribute('href') === targetHash) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }

        showSection(window.location.hash);
        window.addEventListener('hashchange', () => {
            showSection(window.location.hash);
        });
    };

    handleTabbedContent();

    // Logic for the group news page
    const groupNewsSection = document.getElementById('group-news-section');
    if (groupNewsSection) {
        const urlParams = new URLSearchParams(window.location.search);
        const groupName = urlParams.get('groupe');

        const titleElement = document.getElementById('group-name-title');
        const contentElement = document.getElementById('group-news-content');

        if (groupName) {
            titleElement.textContent = `Actualités du Groupe ${groupName}`;
            contentElement.innerHTML = `<p>Désolé, l'actualité du groupe <strong>${groupName}</strong> n'est pour l'instant pas mise à jour.</p>`;
        } else {
            titleElement.textContent = 'Groupe non spécifié';
            contentElement.innerHTML = `<p>Veuillez sélectionner un groupe pour voir ses actualités.</p>`;
        }
    }

    // Mobile Navigation
    const handleMobileNav = () => {
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const closeBtn = document.querySelector('.close-btn');
        const mainNav = document.getElementById('main-nav');
        const dropdowns = document.querySelectorAll('#main-nav .dropdown > .dropbtn');
        const navLinks = document.querySelectorAll('#main-nav a'); // Select all links in the nav

        if (hamburgerBtn && mainNav && closeBtn) {
            hamburgerBtn.addEventListener('click', () => {
                mainNav.classList.add('nav-active');
            });

            closeBtn.addEventListener('click', () => {
                mainNav.classList.remove('nav-active');
            });
        }
        
        if(dropdowns.length > 0) {
            dropdowns.forEach(dropdownBtn => {
                dropdownBtn.addEventListener('click', (e) => {
                    // On mobile, prevent the link from navigating to allow the dropdown to open
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        const parentDropdown = dropdownBtn.parentElement;
                        parentDropdown.classList.toggle('open');
                    }
                });
            });
        }

        // Close mobile menu when a FINAL destination link is clicked
        if (navLinks.length > 0 && mainNav) {
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    // Check if the clicked link is a dropdown toggle on mobile
                    const isDropdownToggle = link.classList.contains('dropbtn');
                    if (isDropdownToggle && window.innerWidth <= 768) {
                        return; // Stop here, let the other listener handle the toggle
                    }

                    // For all other links, close the main nav panel
                    if (mainNav.classList.contains('nav-active')) {
                        mainNav.classList.remove('nav-active');

                        // Also close any open dropdowns
                        document.querySelectorAll('#main-nav .dropdown.open').forEach(openDropdown => {
                            openDropdown.classList.remove('open');
                        });
                    }
                });
            });
        }
    };

    handleMobileNav();
});
