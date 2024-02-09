import "module-alias/register";
import app from "./src/app";
import dbConnect from "./src/db/dbConnect";
import config from "./src/utils/config";

const startServer = () => {
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
};

dbConnect(startServer);
