const { PORT } = require('./utils/config');
const { info } = require('./utils/logger');
const app = require('./app');

app.listen(PORT, () => {
   info(`server run in http://localhost:${PORT}`);
});
