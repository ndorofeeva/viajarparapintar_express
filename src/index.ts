import express, { Application} from 'express';
import cors, { CorsOptions } from "cors";
import dotenv from 'dotenv'
import Routes from './routes';

dotenv.config();

const serverPort: number = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT, 10) : 3000;
const clientPort: number = process.env.CLIENT_PORT ? parseInt(process.env.CLIENT_PORT, 10) : 8080;
const app: Application = express();

const corsOptions: CorsOptions = {
  origin: `http://localhost:${clientPort}`
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

new Routes(app);

app
  .listen(serverPort, "localhost", function () {
    console.log(`Server is running on port ${serverPort}.`);
  })
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log("Error: address already in use");
    } else {
      console.log(err);
    }
  });
  