// Clear all previous registration data to reset counters
localStorage.clear();

document.addEventListener('DOMContentLoaded', function() {

    // Logic for the registration form page
    if (document.getElementById('member-form')) {
        const form = document.getElementById('member-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const newMember = {
                nom: form.nom.value,
                prenoms: form.prenoms.value,
                date_naissance: form.date_naissance.value,
                groupe: form.groupe.value,
                fonction: form.fonction.value,
                identification_aeeeci: form.identification_aeeeci.value,
                formation: form.formation.value,
                residence: form.residence.value,
                eglise: form.eglise.value,
                contact: form.contact.value,
                urgence_nom: form.urgence_nom.value,
                urgence_statut: form.urgence_statut.value,
                urgence_contact: form.urgence_contact.value,
            };

            const members = JSON.parse(localStorage.getItem('districtMembers')) || [];
            members.push(newMember);
            localStorage.setItem('districtMembers', JSON.stringify(members));

            // Redirect to the administration page to see the updated main counter
            window.location.href = 'administration.html#denombrement';
        });
    }

    // --- Counter Update Logic for both administration.html and membres.html ---
    const adminPage = document.getElementById('denombrement');
    const membersPage = document.getElementById('membres-detail');

    if (adminPage || membersPage) {
        const members = JSON.parse(localStorage.getItem('districtMembers')) || [];

        // Calculate counts
        const totalMembers = members.length;
        const chefs = members.filter(m => m.fonction === 'chef').length;
        const louveteaux = members.filter(m => m.fonction === 'louveteau').length;
        const eclaireurs = members.filter(m => m.fonction === 'eclaireur').length;
        const routiers = members.filter(m => m.fonction === 'routier' || m.fonction === 'ra').length;

        // Function to update a counter's data-target
        const setCounter = (id, target) => {
            const counterElement = document.getElementById(id);
            if (counterElement) {
                counterElement.setAttribute('data-target', target);
            }
        };

        // Update counters based on the page
        if (adminPage) {
            setCounter('membres-counter', totalMembers);
        }
        if (membersPage) {
            setCounter('chefs-counter', chefs);
            setCounter('louveteaux-counter', louveteaux);
            setCounter('eclaireurs-counter', eclaireurs);
            setCounter('routiers-counter', routiers);
        }
        
        // --- Counter Animation Logic ---
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
        
        // Use IntersectionObserver if available (from original script.js), otherwise just run
        if (typeof IntersectionObserver !== 'undefined') {
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounters();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            const sectionToObserve = adminPage || membersPage;
            if(sectionToObserve) {
                observer.observe(sectionToObserve);
            }
        } else {
            animateCounters();
        }
    }
});