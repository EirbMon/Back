module.exports = function(app,Skill) {
    const SkillCtrl = require('../controllers/skill.controller.js');
    const GlobalCtrl = require('../controllers/global.controller.js');

    // Create a new Skill
    app.post('/api/skill', (req, res) => {
        SkillCtrl.CreateSkill(req, res, Skill, 'skill');
    });

    // Retrieve All skills
    app.get('/api/skill', (req, res) => {
        SkillCtrl.GetAll(req, res, Skill, 'skill');
    });

    // Retrieve a single skill by Id
    app.get('/api/skill/:_id', (req, res) => {
        GlobalCtrl.GetById(req, res, Skill, 'skill');
    });

    // Retrieve a single skill by name
    app.get('/api/skill/name/:name', (req, res) => {
        GlobalCtrl.GetByName(req, res, Skill, 'skill');
    });

   // Update a Skill with Id
    app.put('/api/skill', (req, res) => {
        GlobalCtrl.Update(req, res, Skill, 'skill');
    });

    // Delete a Skill with Id
    app.delete('/api/skill/:_id', (req, res) => {
        GlobalCtrl.Delete(req, res, Skill, 'skill');
    });
}
