const app = require('./src/app');
const port = process.env.PORT || 3000;

db.connect((error) => {
  if (error) {
    console.error('Error connecting mysql');
    return;
  }
  console.log(`connected to mysql db ${port}`);
});

app.listen(port, ()=> {
  console.log(`app is running at ${port}`);
});
