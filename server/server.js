import express from 'express';
import path from 'path';
import * as url from 'url';
import cors from 'cors';
import fileUpload from "express-fileupload";
import { notFound } from './middleware/pageNotFound.js';
import home from './src/router/home.js';
import admin from './src/router/admin.js';
import amuta from './src/router/amuta.js';
import uploadImage from './src/router/upload.js';
import dotenv from 'dotenv';
dotenv.config();
// import logger from'./middleware/logger.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default function server() {

   const app = express();
   app.use(express.json());
   // app.use(logger);
   app.use(fileUpload({
      limits: { fileSize: 1024 * 1024 * 5 }
   }))

   app.use(express.urlencoded({ extended: false }));
   app.use(express.static(path.join(__dirname, 'public')));

   // הגדרת אדרים מומלצים של אקספרס
   app.use(
      cors({
         origin: "*",
      })
   );

   app.listen(process.env.PORT, () => {
      console.log('Example app listening on port 3000!');
   });

   app.get('/', (req, res) => {
      res.send("home");
   });

   app.use('/home', home);
   app.use('/admin', admin);
   app.use('/amuta', amuta);
   app.use('/upload', uploadImage);
   app.use('*', notFound);

}

