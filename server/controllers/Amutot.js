import bcrypt from 'bcrypt';
import AmutotFunctions from '../models/AmutotFunctions.js';
import Mail from "./ResetPassMail.js"
import fs from 'fs';
import * as fsExtra from 'fs-extra';
import path from 'path';
import * as url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

class Amutot {
  constructor() {
  }
  // API
  static async Login(request, response) {
    let newData = {
      email: request.body.email,
      password: request.body.password
    }
    try {
      let validUser = await AmutotFunctions.validLogin(newData);
      if (validUser.error) {
        console.log(validUser.error.details);
        return response.status(400).json(validUser.error.details);
      }

      let user = await AmutotFunctions.findByEmail(newData.email);

      if (!user[0][0]?.email.length > 0) {
        return response.status(401).json("auth email failed");
      }

      const savedPassword = user[0][0]?.password;

      let comparePass = await bcrypt.compare(newData.password, savedPassword);
      if (!comparePass) {
        return response.status(401).json("auth failed");
      }

      let newToken = await AmutotFunctions.genToken(user[0][0]?.id);
      return response.status(200).json(newToken);

    } catch (error) {
      response.status(400).json(error);
      console.log(error);
    }
  };

  static async getAllPirsumim(request, response) {
    try {
      const [users, _] = await AmutotFunctions.getAllPirsumim(request.body, request.userId);
      response.status(200).json(users);
    } catch (error) {
      response.status(400).json(error);
      console.log(error);
    }
  };

  static async deletePirsum(request, response) {
    try {
      const [users, _] = await AmutotFunctions.deletePirsum(request.body, request.userId);
      response.status(200).json(users);
    } catch (error) {
      response.status(400).json(error);
      console.log(error);
    }
  };

  static async editPirsum(request, response) {
    try {
      const [users, _] = await AmutotFunctions.editPirsum(request.body, request.userId);
      response.status(200).json(users);
    } catch (error) {
      response.status(400).json(error);
      console.log(error);
    }
  };

  static async addPirsum(request, response) {
    try {
      const [users, _] = await AmutotFunctions.addPirsum(request.body, request.userId);
      response.status(200).json(users);
    } catch (error) {
      response.status(400).json(error);
      console.log(error);
    }
  };

  static async finishPirsum(request, response) {
    try {
      const [users, _] = await AmutotFunctions.finishPirsum(request.body, request.userId);
      response.status(200).json(users);
    } catch (error) {
      response.status(400).json(error);
      console.log(error);
    }
  };

  // קבלת פרטי עמותה בכניסה לאזור האישי
  static async getInfo(request, response) {
    try {
      const [users, _] = await AmutotFunctions.getInfo(request.userId);
      response.status(200).json(users[0]);
    } catch (error) {
      response.status(400).json(error);
      console.log(error);
    }
  };

  // עדכון פרטי עמותה 
  static async updateDetails(request, response) {
    let newData = {
      email: request.body.email,
      phone: request.body.phone,
      whatsapp: request.body.whatsapp,
      website: request.body.website,
    }
    try {
      let validUser = await AmutotFunctions.validUpdateDetails(newData);
      if (validUser.error) {
        console.log(validUser.error.details);
        return response.status(400).json(validUser.error.details);
      }

      try {
        const [users, _] = await AmutotFunctions.updateDetails(request.body);
        response.status(200).json(users);
      } catch (error) {
        response.status(400).json(error);
        console.log(error);
      }
    } catch (error) {
      response.status(400).json(error);
      console.log(error);
    }
  };

  // עדכון הגדרות ברירת מחדל
  static async updateDefaults(request, response) {
    try {
      const [users, _] = await AmutotFunctions.updateDefaults(request.body, request.userId);
      response.status(200).json(users);
    } catch (error) {
      response.status(400).json(error);
      console.log(error);
    }
  };

  // מחיקת תמונה מפרסום
  static async deleteImage(request, response) {
    let picturePath = request.body.picturePath;
    let editPath = picturePath.split('/assets/amutot/')[1];
    fs.unlink(path.join(__dirname,"../public/assets/amutot/" + editPath),async (err) => {
        if (err) {
            throw err;
        }
         try {
      const [users, _] = await AmutotFunctions.deleteImage(request.body.pirsum_id);
      response.status(200).json("Delete File successfully.");
      console.log("Delete File successfully.");
    } catch (error) {
      response.status(400).json(error);
      console.log(error);
    }
    });
  };

  // מוחק את תיקיית התמונות של פרסום שנמחק
  static async deleteFolderPirsum(request, response) {
    let pirsum_id = request.body.pirsum_id;
    let amutaEmail = request.body.amutaEmail;
    let folderPath = `${amutaEmail}/pictures/${pirsum_id}`

    fs.rmdir(path.join(__dirname,"../public/assets/amutot/" + folderPath), { recursive: true }, err => {
      if (err) {
        throw err
      }
          response.status(200).json("Delete folder successfully.");
      console.log("Delete File successfully.");
    })
    
  };

  // משנה את תיקיית התמונות של העמותה כאשר משנים כתובת מייל 
  static async renameFolderAmuta(req, res) {
    let oldFolderName = req.body.oldMail
    let newFolderName = req.body.newMail
    let idAmuta = req.userId;

    try {
      const [users, _] = await AmutotFunctions.renameImagesPath(oldFolderName,newFolderName,idAmuta);
      const [users2, _2] = await AmutotFunctions.renameLogoPath(oldFolderName,newFolderName,idAmuta);

      if (users.changedRows > 0 || users2.changedRows > 0) {
        fsExtra.copySync(path.join(__dirname,"../public/assets/amutot/" + oldFolderName), path.join(__dirname,"../public/assets/amutot/" + newFolderName));
        fs.rmdir(path.join(__dirname,"../public/assets/amutot/" + oldFolderName), { recursive: true },async err => {
          if (err) {
            throw err
          }
        })
      }
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json(error);
      console.log(error);
    }


  };
  
  // כפתור שכחתי סיסמה בלוגאין
  static async forgotPassword(request, response) {
    try {
      let user = await AmutotFunctions.findByEmail(request.body.email);
      if (!user[0][0]?.email.length > 0) {
        return response.status(401).json("האימייל לא רשום במערכת");
      }

      let newToken = await AmutotFunctions.genTokenForReset(user[0][0]?.id, user[0][0]?.email);
      let serverHost = request.rawHeaders[21];

      Mail.sendEmail(request.body.email, user[0][0]?.id, serverHost, newToken);
      response.status(200).json(user);
    } catch (error) {
      response.status(400).json(error);
      console.log(error);
    }
  };

  // שינוי סיסמה
  static async resetPassword(req, response) {

    try {
      let validUser = await AmutotFunctions.validResetPassword(req.body.password);
      if (validUser.error) {
        console.log(validUser.error.details);
        return response.status(400).json(validUser.error.details);
      }

      try {
        req.body.newPassword = await bcrypt.hash(req.body.newPassword.toString(), 10);
        const [users2, _] = await AmutotFunctions.resetPassword(req.emailUser, req.body.newPassword);
        response.status(200).json(users2);
      } catch (error) {
        response.status(400).json(error);
        console.log(error);
      }
    } catch (error) {
      response.status(400).json(error);
      console.log(error);
    }
  };

}

export default Amutot;

