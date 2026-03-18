const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Aku AI service is running!');
});

app.listen(port, () => {
  console.log(`Aku AI service listening on port ${port}`);
});
