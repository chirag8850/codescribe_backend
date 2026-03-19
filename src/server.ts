import app from './app.js';
import { config } from './shared/config/config.js';

const PORT = config.server.port;

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${PORT}`);
});
