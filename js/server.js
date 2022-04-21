const express = require('express');
const path = require('path');

const app = express();
const port = 5000;

const routers = require('./routes');

app.use(express.static(path.resolve(__dirname, '../public')));

routers(app);

// Start the server
app.listen(port, (error) => {
  if (error) console.log(`Error: ${error}`);

  console.log(`Server listening on port ${port}`);
});
