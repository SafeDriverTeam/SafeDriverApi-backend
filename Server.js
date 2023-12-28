const express = require("express");
const morgan = require("./middlewares/morgan");
const Logger = require("./utils/Logger");
const config = require("./config");
const cors = require("cors");

class Server {
    constructor() {
        this.app = express();
        this.config = config;
        this.logger = new Logger(this.config.logLevel);
        this.#initMiddlewares();
        this.#initRoutes();
    }

    #setRouteHandler(path, routerModulePath) {
        this.logger.debug(`Setting router for path "${path}"...`);
        this.app.use(path, require(routerModulePath));
    }

    #initMiddlewares() {
        this.app.use(morgan((message) => this.logger.debug({ prefix: "[morgan]", message })));
        this.app.use(express.json());
        var allowedOrigins = ['SafeDriver', 'http://localhost:3000'];
        
        this.app.use(cors());//SE CAMBIO POR PRUEBAS

    }

    #initRoutes() {
        this.#setRouteHandler("/auth", "./routes/auth.js");
        this.#setRouteHandler("/report", "./routes/report.js");
        this.#setRouteHandler("/vehicle","./routes/vehicle.js");
        this.#setRouteHandler("/policy", "./routes/policy.js");
        
    }

    start() {
        this.app.listen(this.config.port, () => {
            this.logger.success(`Server started on port ${this.config.port}`);
        });
    }
}

module.exports = Server;
