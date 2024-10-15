const { PrismaClient } = require('@prisma/client');
const hashPasswordExtension = require('../services/extensions/hashPasswordExtension');
const bcrypt = require('bcrypt');
const authguard = require('../services/authguard');
const companyRouter = require('express').Router();
const prisma = new PrismaClient().$extends(hashPasswordExtension);

// Importation des modules pour la gestion des fichiers
const multer = require('multer');
const fs = require('fs');
const path = require('path');
// Configuration du stockage pour les avatars
const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/avatars/';
        fs.mkdirSync(dir, { recursive: true });
        console.log('Saving file to:', path.resolve(dir));
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname);
        console.log('File will be saved as:', filename);
        cb(null, filename);
    }
});
// Configuration du stockage pour les fichiers de tâches
const taskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/employetask/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
// Création des middlewares pour l'upload de fichiers
const uploadAvatar = multer({ storage: avatarStorage });
const uploadTaskFile = multer({ storage: taskStorage });


// Afficher la page d'inscription
companyRouter.get('/register', (req, res) => {
    res.render('pages/register.twig', { title: "Inscription" });
});
// Inscription d'une entreprise
companyRouter.post('/register', async (req, res) => {
    try {
        if (req.body.password === req.body.confirmPassword) {
            const company = await prisma.company.create({
                data: {
                    name: req.body.name,
                    siret: req.body.siret,
                    director: req.body.director,
                    email: req.body.email,
                    password: await bcrypt.hash(req.body.password, 10),
                }    
            });
            res.redirect('/login');
        } else {
            throw ({confirmPassword: "Les mots de passe ne correspondent pas"});
        }
    } catch (error) {  
        console.log(error);
        res.render("pages/register.twig", {error: error, title: "Inscription"});
    }
});
// Afficher la page de connexion
companyRouter.get('/login', (req, res) => {
    res.render('pages/login.twig', { title: "Connexion" });
});
// Traiter les connexions de la company et de l'employe
companyRouter.post('/login', async (req, res) => {
    try {
        const { email, password, type } = req.body;

        if (type === 'company') {
            const company = await prisma.company.findUnique({
                where: { email: email }
            });

            if (company && await bcrypt.compare(password, company.password)) {
                req.session.company = company;
                res.redirect('/companyDashboard');
            } else {
                throw { password: "Email ou mot de passe incorrect" };
            }
        } else if (type === 'employe') {
            const employe = await prisma.employe.findUnique({
                where: { email: email }
            });

            if (employe && await bcrypt.compare(password, employe.password)) {
                req.session.employe = employe;
                res.redirect('/employeDashboard');
            } else {
                throw { password: "Email ou mot de passe incorrect" };
            }
        } else {
            throw { type: "Type de connexion invalide" };
        }
    } catch (error) {
        console.log(error);
        res.render("pages/login.twig", { error });
    }
});
// Route pour la déconnexion
companyRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Erreur lors de la déconnexion:", err);
        }
        res.redirect('/login');
    });
});


// Afficher le tableau de bord de l'entreprise
companyRouter.get('/companyDashboard', authguard, async (req, res) => {
    try {
        // Récupération des données de l'entreprise avec toutes les relations
        const company = await prisma.company.findUnique({
            where: { id: req.session.company.id },
            include: {
                employes: {
                    include: {
                        ordinateur: true,
                        blames: true,
                        leaveRequests: true
                    }
                },
                ordinateurs: {
                    include: {
                        employe: true
                    }
                },
                blames: {
                    include: {
                        employe: true
                    }
                },
                tasks: {
                    include: {
                        employe: true
                    }
                },
                skills: {
                    include: {
                        employe: true
                    }
                },
                leaveRequests: { 
                    include: {
                        employe: true
                    }
                }
            }
        });
// Rendu de la page avec les données récupérées
        res.render('pages/companyDashboard.twig', {
            title: "Accueil Entreprise",
            company: company,
            employes: company.employes,
            ordinateurs: company.ordinateurs,
            blames: company.blames,
            tasks: company.tasks,
            skills: company.skills,
            leaveRequests: company.leaveRequests 
        });
    } catch (error) {
        console.error("Erreur lors du rendu de companyDashboard.twig:", error);
        res.status(500).send("Erreur lors du rendu de la page.");
    }
});
// Afficher le tableau de bord de l'employé
companyRouter.get('/employeDashboard', authguard, async (req, res) => {
    try {
        // Récupération des données de l'employé avec toutes les relations
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
// Rendu de la page avec les données récupérées
        res.render('pages/employeDashboard.twig', {
            title: "Tableau de bord Employé",
            employe: employe
        });
    } catch (error) {
        console.error("Erreur lors du rendu de employeDashboard.twig:", error);
        res.status(500).send("Erreur lors du rendu de la page.");
    }
});
// Créer un employé
companyRouter.post('/addEmploye', authguard, uploadAvatar.single('avatar'), async (req, res) => {
    try {
        if (req.file) {
            console.log('File uploaded:', req.file.path);
        }
        // Création d'un nouvel employé dans la base de données
        const employe = await prisma.employe.create({
            data: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                age: parseInt(req.body.age),
                sexe: req.body.sexe,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10),
                fonction: req.body.fonction,
                companyId: req.session.company.id,
                avatar: req.file ? req.file.path : undefined
            }
        });

        res.redirect('/companyDashboard');
    } catch (error) {
        console.error("Erreur lors de l'ajout d'un employé:", error);
        res.render("pages/companyDashboard.twig", { error: "Erreur lors de l'ajout de l'employé" });
    }
});
// Afficher le formulaire de modification d'un employé
companyRouter.get('/editEmploye/:id', authguard, uploadAvatar.single('avatar'), async (req, res) => {
    try {
        const employeId = parseInt(req.params.id);
        const employe = await prisma.employe.findUnique({
            where: { id: employeId }
        });

        if (!employe) {
            return res.status(404).send("Employé non trouvé");
        }
        if (req.file) {
            updateData.avatar = req.file.path;
        }

        res.render('pages/edit.twig', { 
            title: "Modifier un employé",
            employe: employe,
            formType: 'employe'
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données de l'employé:", error);
        res.status(500).send("Erreur lors de la récupération des données de l'employé");
    }
});
// Mettre à jour les informations d'un employé
companyRouter.post('/updateEmploye', authguard, async (req, res) => {
    try {
        // Mise à jour des données de l'employé
        const employe = await prisma.employe.update({
            where: { id: parseInt(req.body.employeId) },
            data: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                fonction: req.body.fonction,
                age: parseInt(req.body.age),
                sexe: req.body.sexe
            }
        });
        res.redirect('/companyDashboard');
    } catch (error) {
        console.error("Erreur lors de la modification d'un employé:", error);
        res.render("pages/edit.twig", { 
            error: "Erreur lors de la modification de l'employé",
            employe: req.body
        });
    }
});
// Supprimer un employé
companyRouter.get('/deleteEmploye/:id', authguard, async (req, res) => {
    try {
        const employeId = parseInt(req.params.id);

        // Vérification de l'existence de l'employé
        const employe = await prisma.employe.findUnique({
            where: { id: employeId }
        });

        if (!employe) {
            return res.status(404).json({ error: "Employé non trouvé" });
        }

       // Suppression des relations associées
        await prisma.task.deleteMany({
            where: { employeId: employeId }
        });

        await prisma.blame.deleteMany({
            where: { employeId: employeId }
        });

        await prisma.ordinateur.updateMany({
            where: { employeId: employeId },
            data: { employeId: null }
        });

        // Suppression de l'employé
        await prisma.employe.delete({
            where: { id: employeId }
        });

        res.redirect('/companyDashboard');
    } catch (error) {
        console.error("Erreur lors de la suppression d'un employé:", error);
        res.status(500).json({ error: "Erreur lors de la suppression de l'employé" });
    }
});

// Créer un ordinateur
companyRouter.post('/addOrdinateur', authguard, async (req, res) => {
    try {
        const ordinateur = await prisma.ordinateur.create({
            data: {
                modele: req.body.modele,
                macAddress: req.body.macAddress,
                companyId: req.session.company.id,
                isDefective: req.body.isDefective === 'true',
                defectiveAt: req.body.isDefective === 'true' ? new Date() : null
            }
        });
        res.redirect('/companyDashboard');
    } catch (error) {
        console.error("Erreur lors de la création d'un ordinateur:", error);
        res.status(500).json({ success: false, error: "Erreur lors de la création de l'ordinateur" });
    }
});

// Modifier un ordinateur
companyRouter.get('/editOrdinateur/:id', authguard, async (req, res) => {
    try {
        const ordinateurId = parseInt(req.params.id);
        const ordinateur = await prisma.ordinateur.findUnique({
            where: { id: ordinateurId }
        });

        if (!ordinateur) {
            return res.status(404).send("Ordinateur non trouvé");
        }

        res.render('pages/edit.twig', { 
            title: "Modifier un ordinateur",
            ordinateur: ordinateur,
            formType: 'ordinateur'
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données de l'ordinateur:", error);
        res.status(500).send("Erreur lors de la récupération des données de l'ordinateur");
    }
});
// Mettre à jour les informations d'un ordinateur
companyRouter.post('/updateOrdinateur', authguard, async (req, res) => {
    try {
        const updateData = {
            modele: req.body.modele,
            macAddress: req.body.macAddress,
            isDefective: req.body.isDefective === 'true',
            defectiveAt: req.body.isDefective === 'true' ? new Date() : null,
        };
// Mise à jour des données de l'ordinateur
        const updatedOrdinateur = await prisma.ordinateur.update({
            where: { id: parseInt(req.body.ordinateurId) },
            data: updateData
        });

        res.redirect('/companyDashboard');
    } catch (error) {
        console.error("Erreur détaillée lors de la modification d'un ordinateur:", error);
        res.status(500).json({ success: false, error: error.message || "Erreur lors de la modification de l'ordinateur" });
    }
});


// Supprimer un ordinateur
companyRouter.get('/deleteOrdinateur/:id', authguard, async (req, res) => {
    try {
        const ordinateurId = parseInt(req.params.id);
        // Vérifier si l'ordinateur existe et appartient à l'entreprise
        const ordinateur = await prisma.ordinateur.findUnique({
            where: { id: ordinateurId },
            include: { company: true }
        });

        if (!ordinateur) {
            throw new Error("Ordinateur non trouvé");
        }

        if (ordinateur.companyId !== req.session.company.id) {
            throw new Error("Vous n'avez pas l'autorisation de supprimer cet ordinateur");
        }

        // Supprimer l'ordinateur
        await prisma.ordinateur.delete({
            where: { id: ordinateurId }
        });

        res.redirect('/companyDashboard');
    } catch (error) {
        console.error("Erreur lors de la suppression de l'ordinateur:", error);
        res.status(400).render("/companyDashboard", {
            error: error.message,
            company: req.session.company
        });
    }
});

// Assigner un ordinateur à un employé
companyRouter.post('/assignOrdinateur', authguard, async (req, res) => {
    try {
        const updatedOrdinateur = await prisma.ordinateur.update({
            where: { id: parseInt(req.body.ordinateurId) },
            data: {
                employe: {
                    connect: { id: parseInt(req.body.employeId) }
                }
            }
        });
        res.redirect('/companyDashboard');
    } catch (error) {
        console.error("Erreur lors de l'assignation d'un ordinateur:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Ajouter un blâme
companyRouter.post('/addBlame', authguard, async (req, res) => {
    try {
        const blame = await prisma.blame.create({
            data: {
                description: req.body.description,
                employeId: parseInt(req.body.employeId),
                companyId: req.session.company.id
            }
        });
        res.redirect('/companyDashboard');
    } catch (error) {
        console.error("Erreur lors de l'ajout d'un blâme:", error);
        res.render("pages/companyDashboard.twig", { error: "Erreur lors de l'ajout du blâme" });
    }
});
// Supprimer un blâme
companyRouter.post('/deleteBlame/:id', authguard, async (req, res) => {
    try {
        const blameId = parseInt(req.params.id);

        // Vérifiez si le blâme existe
        const blame = await prisma.blame.findUnique({
            where: { id: blameId }
        });

        if (!blame) {
            return res.status(404).json({ error: "Blâme non trouvé" });
        }

        // Supprimez le blâme
        await prisma.blame.delete({
            where: { id: blameId }
        });

        res.redirect('/companyDashboard');
    } catch (error) {
        console.error("Erreur lors de la suppression d'un blâme:", error);
        res.status(500).json({ error: "Erreur lors de la suppression du blâme" });
    }
});
// Ajouter une tâche
companyRouter.post('/addTask', authguard, async (req, res) => {
    try {
        const task = await prisma.task.create({
            data: {
                title: req.body.title,
                description: req.body.description,
                dueDate: new Date(req.body.dueDate),
                status: 'A_FAIRE', 
                employeId: parseInt(req.body.employeId),
                companyId: req.session.company.id,
            }
        });

        res.redirect('/companyDashboard');
    } catch (error) {
        console.error("Erreur lors de l'ajout d'une tâche:", error);
        res.render("pages/companyDashboard.twig", { error: "Erreur lors de l'ajout de la tâche" });
    }
});
// Obtenir les tâches d'un employé
companyRouter.get('/employeTasks/:employeId', authguard, async (req, res) => {
    try {
        // Récupération des tâches de l'employé
        const tasks = await prisma.task.findMany({
            where: {
                employeId: parseInt(req.params.employeId),
                companyId: req.session.company.id
            }
        });
        res.render('/companyDashboard');
    } catch (error) {
        console.error("Erreur lors de la récupération des tâches:", error);
        res.status(500).json({ error: "Erreur lors de la récupération des tâches" });
    }
});

// Afficher le formulaire de modification d'une tâche
companyRouter.get('/editTask/:id', authguard, async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const task = await prisma.task.findUnique({
            where: { id: taskId }
        });

        if (!task) {
            return res.status(404).send("Tâche non trouvée");
        }

        const employes = await prisma.employe.findMany({
            where: { companyId: req.session.company.id }
        });

        res.render('pages/edit.twig', {
            title: "Modifier une tâche",
            task: task,
            employes: employes,
            formType: 'task' 
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données de la tâche:", error);
        res.status(500).send("Erreur lors de la récupération des données de la tâche");
    }
});


// Mettre à jour les informations des taches
companyRouter.post('/updateTask', authguard, async (req, res) => {
    try {
        const updatedTask = await prisma.task.update({
            where: { id: parseInt(req.body.taskId) },
            data: {
                title: req.body.title,
                description: req.body.description,
                dueDate: new Date(req.body.dueDate),
                status: req.body.status,
                employeId: parseInt(req.body.employeId)
            }
        });
        res.redirect('/companyDashboard');
    } catch (error) {
        console.error("Erreur lors de la modification d'une tâche:", error);
        res.render("pages/edit.twig", {
            error: "Erreur lors de la modification de la tâche",
            task: req.body
        });
    }
});


// Supprimer une tâche
companyRouter.get('/deleteTask/:id', authguard, async (req, res) => {
    try {
        const taskId = parseInt(req.params.id);

        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { company: true }
        });

        if (!task) {
            throw new Error("Tâche non trouvée");
        }

        
        if (task.companyId !== req.session.company.id) {
            throw new Error("Vous n'avez pas l'autorisation de supprimer cette tâche");
        }
// Suppression de la tâche
        await prisma.task.delete({
            where: { id: taskId } 
        });

        res.redirect('/companyDashboard');
    } catch (error) {
        console.error("Erreur lors de la suppression de la tâche:", error);
        res.status(400).render("pages/companyDashboard.twig", {
            error: error.message,
            company: req.session.company
        });
    }
});
// Ajouter une compétence/formation
companyRouter.post('/addSkill', authguard, async (req, res) => {
    try {
      const skill = await prisma.skill.create({
        data: {
          name: req.body.name,
          startDate: new Date(req.body.startDate),
          endDate: new Date(req.body.endDate),
          companyId: req.session.company.id  // Assurez-vous d'ajouter cette ligne
        }
      });
      res.redirect('/companyDashboard');
    } catch (error) {
      console.error("Erreur lors de l'ajout de la fomation:", error);
      res.status(500).json({ error: "Erreur lors de l'ajout de la formation" });
    }
  });
  // Assigner une compétence/formation à un employé
companyRouter.post('/assignSkill', authguard, async (req, res) => {
  try {
    const { employeId, skillId } = req.body;
    // Vérification que les IDs sont bien des nombres
    const employeIdInt = parseInt(employeId);
    const skillIdInt = parseInt(skillId);

    if (isNaN(employeIdInt) || isNaN(skillIdInt)) {
      throw new Error("Les IDs doivent être des nombres valides");
    }
// Mise à jour de l'employé pour lui assigner la compétence
    const updatedEmploye = await prisma.employe.update({
      where: { id: employeIdInt },
      data: {
        skills: {
          connect: { id: skillIdInt }
        }
      }
    });

    res.redirect('/companyDashboard');
  } catch (error) {
    console.error("Erreur détaillée lors de l'attribution de la compétence:", error);
    res.status(500).json({ error: error.message || "Erreur lors de l'attribution de la compétence" });
  }
});
// Récupérer toutes les compétences/formations
companyRouter.get('/skill', authguard, async (req, res) => {
    try {
      const skill = await prisma.skill.findMany({
        include: { employe: true }
      });
      res.render('/companyDashboard');
    } catch (error) {
      console.error("Erreur détaillée lors de la récupération des formations:", error);
      res.status(500).render('error', { error: "Erreur lors de la récupération des formations" });
    }
  });
  // modifier une compétence/formation
  companyRouter.get('/editSkill/:id', authguard, async (req, res) => {
    try {
      const skillId = parseInt(req.params.id);
      const skill = await prisma.skill.findUnique({
        where: { id: skillId },
      });
  
      if (!skill) {
        return res.status(404).send('Skill not found');
      }
  
      res.render("pages/edit.twig", { 
        title: "Modifier une formation",
        formType: 'skill', 
        skill: skill 
      });
    } catch (error) {
      console.error("Error fetching skill for edit:", error);
      res.status(500).json({ error: "Error fetching skill for edit" });
    }
  });
  
  // Update skill route
  companyRouter.post('/updateSkill/:id', authguard, async (req, res) => {
    try {
      const skillId = parseInt(req.params.id);
      const updatedSkill = await prisma.skill.update({
        where: { id: skillId },
        data: {
          name: req.body.name,
          startDate: new Date(req.body.startDate),
          endDate: new Date(req.body.endDate),
        },
      });
  
      res.redirect('/companyDashboard');
    } catch (error) {
      console.error("Error updating skill:", error);
      res.status(500).json({ error: "Error updating skill" });
    }
  });
  
  // Supprimer une compétence/formation
  companyRouter.get('/deleteSkill/:id', authguard, async (req, res) => {
    try {
      const skillId = parseInt(req.params.id);
      await prisma.skill.delete({
        where: { id: skillId },
      });
  
      res.redirect('/companyDashboard');
    } catch (error) {
      console.error("Error deleting skill:", error);
      res.status(500).json({ error: "Error deleting skill" });
    }
  });
  

  // Validation ou refusement d'une demande de congé
  companyRouter.post('/validateLeave/:id', authguard, async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body;
// Mise à jour du statut de la demande de congé
        await prisma.leaveRequest.update({
            where: { id: parseInt(id) },
            data: { status: action }
        });

        res.redirect('/companyDashboard');
    } catch (error) {
        console.error("Erreur lors de la validation/refus de la demande de congé:", error);
        res.status(500).send("Erreur lors de la mise à jour de la demande de congé");
    }
});
// Proposer des dates alternatives
companyRouter.post('/proposeAlternative/:id', authguard, async (req, res) => {
    try {
        const { id } = req.params;
        const { alternativeStartDate, alternativeEndDate } = req.body;
// Mise à jour de la demande de congé avec les dates alternatives proposées
        await prisma.leaveRequest.update({
            where: { id: parseInt(id) },
            data: { 
                status: 'ALTERNATIVE_PROPOSEE',
                alternativeStartDate: new Date(alternativeStartDate),
                alternativeEndDate: new Date(alternativeEndDate)
            }
        });

        res.redirect('/companyDashboard');
    } catch (error) {
        console.error("Erreur lors de la proposition de dates alternatives:", error);
        res.status(500).send("Erreur lors de la proposition de dates alternatives");
    }
});

module.exports = companyRouter;
