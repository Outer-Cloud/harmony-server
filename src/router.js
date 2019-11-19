const routes = require('./routes');

module.exports = (app) => {
    
    app.use('/api', routes);

    app.get('*', (req, res) => {
        res.send('Health');
    });
}
