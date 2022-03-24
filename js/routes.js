const router = (app) => {
  app.get('/', (request, response) => {
    response.status(200)
      .type('text/plain');
    response.sendfile('index.html');
  });

  app.get('/about', (request, response) => {
    response.status(200)
      .type('text/plain');
    response.send({
      message: 'The calendar app. Node.js and Express REST API.',
    });
  });
};

// Export the router
module.exports = router;
