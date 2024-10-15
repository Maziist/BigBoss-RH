const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authguard = async (req, res, next) => {
    try {
        if (req.session.company) {
            let user = await prisma.company.findUnique({
                where: {
                    email: req.session.company.email
                }
            });
            if (user) return next();
        } else if (req.session.employe) {
            let user = await prisma.employe.findUnique({
                where: {
                    email: req.session.employe.email
                }
            });
            if (user) return next();
        }
        throw { authguard: "Utilisateur non connecté" };
    } catch (error) {
        res.redirect("/login");
    }
};
module.exports = (req, res, next) => {
    if (req.session.company || req.session.employe) {
        next();
    } else {
        res.redirect('/login');
    }
};

module.exports = authguard;