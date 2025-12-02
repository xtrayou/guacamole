const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`SISKEUDES Server Berjalan`);
  console.log(`Buka browser di: http://localhost:${PORT}`);
  console.log(`=============================================`);
});
