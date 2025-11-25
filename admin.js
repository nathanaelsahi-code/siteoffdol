document.addEventListener('DOMContentLoaded', function() {
    // --- Password Protection ---
    const correctPassword = "SAKSDOL";
    const enteredPassword = prompt("Veuillez entrer le mot de passe pour accéder à l'espace admin :");

    if (enteredPassword !== correctPassword) {
        alert("Mot de passe incorrect. Vous allez être redirigé.");
        window.location.href = "index.html";
        return; // Stop script execution if password is wrong
    }

    // --- Dashboard Rendering ---
    const dashboardContent = document.getElementById('dashboard-content');
    if (!dashboardContent) return;

    const members = JSON.parse(localStorage.getItem('districtMembers')) || [];

    if (members.length === 0) {
        dashboardContent.innerHTML = "<p>Aucun membre n'a été enregistré pour le moment.</p>";
        return;
    }

    // Count members by function
    const memberCounts = {
        chef: 0,
        louveteau: 0,
        eclaireur: 0,
        routier: 0,
        ra: 0
    };

    members.forEach(member => {
        if (member.fonction in memberCounts) {
            memberCounts[member.fonction]++;
        }
    });

    // Generate HTML for member counts
    let countsHtml = `
        <div class="member-counts">
            <h3>Statistiques des Membres</h3>
            <p><strong>Total des membres actifs:</strong> <span class="animated-counter" data-target="${members.length}">0</span></p>
            <p><strong>Chefs:</strong> <span class="animated-counter" data-target="${memberCounts.chef}">0</span></p>
            <p><strong>Louveteaux:</strong> <span class="animated-counter" data-target="${memberCounts.louveteau}">0</span></p>
            <p><strong>Éclaireurs:</strong> <span class="animated-counter" data-target="${memberCounts.eclaireur}">0</span></p>
            <p><strong>Routiers:</strong> <span class="animated-counter" data-target="${memberCounts.routier}">0</span></p>
            <p><strong>RA:</strong> <span class="animated-counter" data-target="${memberCounts.ra}">0</span></p>
        </div>
    `;

    // Group members by their 'groupe'
    const groupedMembers = members.reduce((acc, member) => {
        const group = member.groupe || 'Non spécifié';
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(member);
        return acc;
    }, {});

    // Generate HTML for each group
    let tableHtml = '';
    for (const groupName in groupedMembers) {
        tableHtml += `<h3>Groupe : ${groupName}</h3>`;
        tableHtml += `<table class="admin-table">`;
        tableHtml += `
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Prénoms</th>
                    <th>Date de Naissance</th>
                    <th>Fonction/Unité</th>
                    <th>ID AEEECI</th>
                    <th>Formation</th>
                    <th>Résidence</th>
                    <th>Église</th>
                </tr>
            </thead>
        `;
        tableHtml += '<tbody>';
        
        groupedMembers[groupName].forEach(member => {
            tableHtml += `
                <tr>
                    <td>${member.nom || ''}</td>
                    <td>${member.prenoms || ''}</td>
                    <td>${member.date_naissance || ''}</td>
                    <td>${member.fonction || ''}</td>
                    <td>${member.identification_aeeeci || ''}</td>
                    <td>${member.formation || ''}</td>
                    <td>${member.residence || ''}</td>
                    <td>${member.eglise || ''}</td>
                </tr>
            `;
        });

        tableHtml += '</tbody></table>';
    }

    dashboardContent.innerHTML = countsHtml + tableHtml;

    // --- Counter Animation Logic ---
    const counters = document.querySelectorAll('.animated-counter');
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

    if (typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const sectionToObserve = document.querySelector('.member-counts');
        if(sectionToObserve) {
            observer.observe(sectionToObserve);
        }
    } else {
        animateCounters();
    }
});
