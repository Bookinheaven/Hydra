require('dotenv').config();
const app = require("./src/app");
const { PORT } = require("./src/config/env");

app.listen(PORT, () => {
  console.log(`🚀 Express enterprise API server running on http://localhost:${PORT}`);
});
