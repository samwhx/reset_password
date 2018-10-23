const express = require('express'),
      path = require('path'),
      bodyParser = require('body-parser'),
      cors = require('cors');

const app = express();

const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000;
app.listen(PORT, () => {
    console.info(`Application started on port %d at %s`, PORT, new Date());
})