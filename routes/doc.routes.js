module.exports = function(app) {
    const DocCtrl = require('../controllers/doc.controllers.js');

    // Open documentation Swagger
    app.get('/api/doc', (req, res) => {
        DocCtrl.GetDoc(req, res);
    });
}
