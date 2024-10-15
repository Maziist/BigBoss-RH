function toggleForm(formId) {
  const form = document.getElementById(formId);
  if (form.classList.contains('hidden')) {
    form.classList.remove('hidden');
  } else {
    form.classList.add('hidden');
  }
}

async function fetchTasks(employeId) {
  try {
      console.log("Fetching tasks for employeId:", employeId);
      const response = await fetch(`/employeTasks/${employeId}`);
      const tasks = await response.json();
      console.log("Fetched tasks:", tasks);
      displayTasks(tasks);
  } catch (error) {
      console.error("Erreur lors de la récupération des tâches:", error);
  }
}

function displayTasks(tasks) {
  console.log("Displaying tasks:", tasks);
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = ''; // Clear previous tasks
  tasks.forEach(task => {
      const taskItem = document.createElement('div');
      taskItem.innerHTML = `
          <h3>${task.title}</h3>
          <p>${task.description}</p>
          <p>Date d'échéance: ${new Date(task.dueDate).toLocaleDateString()}</p>
          <p>Statut: ${task.status}</p>
      `;
      taskList.appendChild(taskItem);
  });
}

