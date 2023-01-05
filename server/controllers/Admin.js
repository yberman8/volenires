import AdminFunctions from '../models/AdminFunctions.js';
import Mail from "./CreateMail.js"
import bcrypt from 'bcrypt';
import fs from 'fs';
import * as fsExtra from 'fs-extra';
import path from 'path';
import * as url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

class Admin {
  constructor() {
  }

  // API


  static async getAllAmutot(req, res) {
    try {
      const [users, _] = await AdminFunctions.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(200).json(users);
      console.log(error);
    }
  };

  static async getNumOfPirsumim(req, res) {
    try {
      const [users, _] = await AdminFunctions.getNumOfPirsumim();
      res.status(200).json(users);
    } catch (error) {
      res.status(200).json(users);
      console.log(error);
    }
  };

  static async createAmuta(request, response) {
    let newDataToValid = {
      email: request.body.email,
      phone: request.body.phone,
    }

    try {
      let validUser = await AdminFunctions.validAddAmuta(newDataToValid);
      if (validUser.error) {
        console.log(validUser.error.details);
        return response.status(400).json(validUser.error.details);
      }
      let originalPass = request.body.password;
      let serverHost = request.rawHeaders[21];

      try {
        const [users, _] = await AdminFunctions.save(request.body);
        Mail.sendEmail(request.body.email, originalPass, serverHost);
        response.status(200).json(users.insertId);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      response.status(400).json(error);
      console.log(error);
    }
  };

  // עריכת פרטי עמותה בסיסיים
  static async editAmuta(request, response) {
    console.log(request.userId);
    let updateData = {
      id: request.body.id,
      name: request.body.name,
      email: request.body.email,
      phone: request.body.phone,
      notes: request.body.notes,
    }
    try {
      const [users, _] = await AdminFunctions.update(updateData);
      response.status(200).json(users.insertId);
    } catch (error) {
      response.status(400).json(error);
      console.log(error);
    }
  };

  static async deleteAmuta(request, response) {
    let deleteID = request.body.id;
    try {
      const [users, _] = await AdminFunctions.delete(deleteID);
      response.status(200).json(users.insertId);
    } catch (error) {
      response.status(400).json(error);
    }
  };

  static async enableOrDisableAmuta(request, response) {
    let updateData = {
      id: request.body.id,
      status: request.body.status,
    }
    try {
      const [users, _] = await AdminFunctions.changeStatus(updateData);
      response.status(200).json(users.insertId);
    } catch (error) {
      console.log(error);
      response.status(400).json(error);
    }
  };

  // קבלת פרטי עמותה לצורך עריכת פרסומים
  static async detailsAmuta(req, res) {
    try {
      const [users, _] = await AdminFunctions.detailsAmuta(req.body.amutaId);
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  };


  static async getAmutaPirsumim(req, res) {
    try {
      const [users, _] = await AdminFunctions.getAmutaPirsumim(req.body);
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  };

  static async deletePirsum(req, res) {
    try {
      const [users, _] = await AdminFunctions.deletePirsum(req.body.pirsum_id);
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  };

  static async finishPirsum(req, res) {
    try {
      const [users, _] = await AdminFunctions.finishPirsum(req.body.id_pirsum);
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  };

  // שינוי שם תיקיית תמונות עמותה בעת שינוי כתובת המייל שלה
  static async renameFolderAmuta(req, res) {
    let oldFolderName = req.body.oldMail
    let newFolderName = req.body.newMail

    try {
      const [users, _] = await AdminFunctions.renameImagesPath(oldFolderName, newFolderName);
      const [users2, _2] = await AdminFunctions.renameLogoPath(oldFolderName, newFolderName);

      if (users.changedRows > 0 || users2.changedRows > 0) {
        fsExtra.copySync(path.join(__dirname, "../public/assets/amutot/" + oldFolderName), path.join(__dirname, "../public/assets/amutot/" + newFolderName));
        fs.rmdir(path.join(__dirname, "../public/assets/amutot/" + oldFolderName), { recursive: true }, async err => {
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

  
  static validAddAmuta(body) {
    let userSchema = joi.object({
      email: joi.string().email(),

    });
    return userSchema.validate(body)
  }

  static async resetAmutaPassword(req, res) {
    req.body.newPassword = await bcrypt.hash(req.body.newPassword.toString(), 10);
    try {
      const [users, _] = await AdminFunctions.resetAmutaPassword(req.body.newPassword, req.body.userId);
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json(error);
      console.log(error);
    }
  };

}

export default Admin;