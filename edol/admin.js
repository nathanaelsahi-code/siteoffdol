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
    let html = '';
    for (const groupName in groupedMembers) {
        html += `<h3>Groupe : ${groupName}</h3>`;
        html += `<table class="admin-table">`;
        html += `
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
        html += '<tbody>';
        
        groupedMembers[groupName].forEach(member => {
            html += `
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

        html += '</tbody></table>';
    }

    dashboardContent.innerHTML = html;
});
