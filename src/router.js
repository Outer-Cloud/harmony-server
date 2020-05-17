
module.exports = (app, routes) => {
    
    app.use('/api', routes);

    app.get('*', (req, res) => {
        res.send('Health');
    });
};
