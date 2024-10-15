document.getElementById('projectForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch('/addProject', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(project => {
        const projectList = document.getElementById('projectList');
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <p>Date de début : ${new Date(project.startDate).toLocaleDateString()}</p>
            <p>Date de fin : ${new Date(project.endDate).toLocaleDateString()}</p>
        `;
        projectList.appendChild(projectCard);
        this.reset();
        toggleForm('projectForm');
    })
    .catch(error => console.error('Erreur:', error));
});
