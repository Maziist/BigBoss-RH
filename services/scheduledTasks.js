const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fonction pour mettre à jour les tâches échues
async function updateOverdueTasks() {
    const now = new Date();
    now.setHours(17, 0, 0, 0); // Définir l'heure à 17:00:00

    try {
        const updatedTasks = await prisma.task.updateMany({
            where: {
                dueDate: {
                    lte: now
                },
                status: {
                    not: 'TERMINEE'
                }
            },
            data: {
                status: 'ECHEANCE_DEPASSEE'
            }
        });

        console.log(`${updatedTasks.count} tâches marquées comme "Échéance dépassée"`);
    } catch (error) {
        console.error("Erreur lors de la mise à jour des tâches échues:", error);
    }
}

// Planifier la tâche pour s'exécuter tous les jours à 17h
const scheduleTaskUpdates = () => {
    cron.schedule('0 17 * * *', () => {
        console.log('Exécution de la mise à jour des tâches échues');
        updateOverdueTasks();
    });
};

module.exports = { scheduleTaskUpdates };
