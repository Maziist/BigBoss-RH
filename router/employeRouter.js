const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authguard = require('../services/authguard');

const employeRouter = express.Router();

// Afficher le tableau de bord de l'employé
employeRouter.get('/employeDashboard', authguard, async (req, res) => {
    try {
        const employe = await prisma.employe.findUnique({
            where: { id: req.session.employe.id },
            include: {
                ordinateur: true,
                blames: true,
                leaveRequests: true,
                tasks: true,
                skills: true
            }
        });

        res.render('pages/employeDashboard.twig', {
            title: "Tableau de bord Employé",
            employe: employe
        });
    } catch (error) {
        console.error("Erreur lors du rendu de employeDashboard.twig:", error);
        res.status(500).send("Erreur lors du rendu de la page.");
    }
});

// Faire une demande de congé
employeRouter.post('/requestLeave', authguard, async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const leaveRequest = await prisma.leaveRequest.create({
            data: {
                startDate: new Date(req.body.startDate),
                endDate: new Date(req.body.endDate),
                reason: req.body.reason,
                status: 'EN_ATTENTE',
                employeId: req.session.employe.id,
                companyId: req.session.employe.companyId
            }
        });
        res.redirect('/employeDashboard');
    } catch (error) {
        console.error("Erreur lors de la création de la demande de congé:", error);
        res.status(500).send("Erreur lors de la création de la demande de congé.");
    }
});

// Valider ou refuser une demande de congé
employeRouter.post('/respondToAlternative/:id', authguard, async (req, res) => {
    try {
        const { id } = req.params;
        const { response } = req.body;

        let newStatus;
        if (response === 'approve') {
            newStatus = 'APPROUVEE';
        } else if (response === 'reject') {
            newStatus = 'REFUSEE';
        } else {
            throw new Error('Réponse invalide');
        }

        await prisma.leaveRequest.update({
            where: { id: parseInt(id) },
            data: { 
                status: newStatus,
                startDate: response === 'approve' ? prisma.leaveRequest.findUnique({ where: { id: parseInt(id) } }).alternativeStartDate : undefined,
                endDate: response === 'approve' ? prisma.leaveRequest.findUnique({ where: { id: parseInt(id) } }).alternativeEndDate : undefined
            }
        });

        res.redirect('/employeDashboard');
    } catch (error) {
        console.error("Erreur lors de la réponse à l'alternative:", error);
        res.status(500).send("Erreur lors de la réponse à l'alternative");
    }
});

// Signaler que l'ordinateur est défectueux
employeRouter.post('/reportDefectiveComputer', authguard, async (req, res) => {
    try {
        const updatedOrdinateur = await prisma.ordinateur.update({
            where: { id: parseInt(req.body.ordinateurId) },
            data: {
                isDefective: true,
                defectiveAt: new Date()
            }
        });
        res.redirect('/employeDashboard');
    } catch (error) {
        console.error("Erreur lors de la signalisation de l'ordinateur défectueux:", error);
        res.status(500).send("Erreur lors de la signalisation de l'ordinateur défectueux.");
    }
});

employeRouter.post('/updateTaskStatus', authguard, async (req, res) => {
    try {
        const taskId = parseInt(req.body.taskId);
        const newStatus = req.body.status;

        const task = await prisma.task.findUnique({
            where: { id: taskId }
        });

        if (task.status === 'ECHEANCE_DEPASSEE' && newStatus !== 'TERMINEE') {
            throw new Error("Une tâche dont l'échéance est dépassée ne peut être marquée que comme terminée.");
        }

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: { status: newStatus }
        });

        res.redirect('/employeDashboard');
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut de la tâche:", error);
        res.status(500).render("pages/employeDashboard.twig", {
            error: error.message,
            employe: req.session.employe
        });
    }
});

module.exports = employeRouter;
