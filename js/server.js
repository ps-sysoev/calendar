const express = require('express');

const app = express();
const port = 5000;

const routers = require('./routes');

app.use(express.static('e:\\progr\\calendar'));

routers(app);

// Start the server
app.listen(port, (error) => {
  if (error) console.log(`Error: ${error}`);

  console.log(`Server listening on port ${port}`);
});
