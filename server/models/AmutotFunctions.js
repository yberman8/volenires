import db from "../database/db.js";
import joi from "joi"
import jwt from 'jsonwebtoken';
import AdminFunctions from '../models/AdminFunctions.js';
import dotenv from 'dotenv'
dotenv.config();

class AmutotFunctions {
  constructor() { }

  static validResetPassword(body) {
    let userSchema = joi.object({
      newPassword: joi.string().trim().min(6),
    });
    return userSchema.validate(body)
  }

  static validLogin(body) {
    let userSchema = joi.object({
      email: joi.string(),
      password: joi.string(),

    });
    return userSchema.validate(body)
  }

  static validUpdateDetails(body) {
    let userSchema = joi.object({
      email: joi.string().required().email(),
      phone: joi.string().trim(),
      whatsapp: joi.string().trim(),
      website: joi.string().trim(),
    });
    return userSchema.validate(body)
  }

  static async genToken(id) {
    let token = jwt.sign({ _id: id }, process.env.SECRET_WORD, { expiresIn: "1d" })
    return token;
  }

  static async genTokenForReset(id, email) {
    let token = jwt.sign({ _id: id, _email: email }, process.env.SECRET_WORD, { expiresIn: "1h" })
    return token;
  }
  //  expiresIn: "10h" it will be expired after 10 hours
  //expiresIn: "20d" // it will be expired after 20 days
  //expiresIn: 120 // it will be expired after 120ms
  //expiresIn: "120s" // it will be expired after 120s

  static async findByEmail(email) {
    let sql = `SELECT id,password,email FROM amutot WHERE email = ?`;
    return await db.execute(sql, [email]);
  }

  static async getInfo(userId) {
    let sql = `SELECT * FROM amutot WHERE id = ?`;
    return await db.execute(sql, [userId]);
  }

  static async getAllPirsumim(filter, userId) {
    if (filter.filtered === "הכל") {
      let sql = `SELECT * FROM pirsumim WHERE amuta_id = ?`;
      return await db.execute(sql, [userId]);
    }
    let sql = `SELECT * FROM pirsumim WHERE amuta_id = ? AND status_pirsum = ?`;
    return await db.query(sql, [userId, filter.filtered]);
  }

  static async deletePirsum(Data, userId) {
    let sql = `DELETE FROM pirsumim WHERE id_pirsum = ? AND amuta_id = ?`
    return await db.query(sql, [Data.pirsum_id, userId])
  }

  static async editPirsum(Data, userId) {
    try {
      const [users, _] = await AdminFunctions.checkIfAdmin(userId);
      const isSuperManager = users[0]?.is_super_manager === 1;

      const sql = `UPDATE pirsumim SET title=?, content=?, pirsum_show_phone=?, pirsum_show_email=?, pirsum_show_whatsapp=?, zone=?, pick_up_address=?, text_finish=?, picture=? WHERE id_pirsum = ${isSuperManager ? '?' : '? AND amuta_id=?'}`;
      const params = [Data.title, Data.content, Data.pirsum_show_phone, Data.pirsum_show_email, Data.pirsum_show_whatsapp, Data.zone, Data.pick_up_address, Data.text_finish, Data.picture, Data.id_pirsum, (isSuperManager ? [] : [userId])];

      return await db.query(sql, params);
    } catch (error) {
      console.log(error);
    }
  }

  static async addPirsum(Data, userId) {
    let sql = `INSERT INTO pirsumim (title, content, pick_up_address,zone,text_finish,amuta_id,pirsum_show_phone,pirsum_show_email,pirsum_show_whatsapp,picture) VALUES (?,?,?,?,?,?,?,?,?,?)`;
    return await db.query(sql, [Data.title, Data.content, Data.pick_up_address, Data.zone, Data.text_finish, userId, Data.pirsum_show_phone, Data.pirsum_show_email, Data.pirsum_show_whatsapp, Data.picture]);
  }

  static async finishPirsum(Data, userId) {
    let sql = `UPDATE pirsumim SET status_pirsum= ? WHERE id_pirsum = ? AND amuta_id = ?`
    return await db.query(sql, ["הסתיימו", Data.id_pirsum, userId])
  }

  static async updateDetails(Data) {
    let sql = `UPDATE amutot SET name= ?,phone= ?,whatsapp= ?,email= ?,about= ?,
   contact_name= ?,contact_phone= ?,contact_email= ?,logo= ?,website= ?,city= ? WHERE id = ?`
    return await db.query(sql, [Data.name, Data.phone, Data.whatsapp, Data.email, Data.about,
    Data.contact_name, Data.contact_phone, Data.contact_email, Data.logo, Data.website, Data.city, Data.id])
  }

  static async updateDefaults(Data, userId) {
    let sql = `UPDATE amutot SET default_show_email= ?,default_show_phone= ?,default_show_whatsapp= ? WHERE id = ?`
    return await db.query(sql, [Data.showEmail, Data.showPhone, Data.showWhatsapp, userId])
  }

  static async deleteImage(pirsum_id) {
    let sql = `UPDATE pirsumim SET picture=? WHERE id_pirsum = ?`
    return await db.query(sql, ["", pirsum_id])
  }

  static async renameImagesPath(oldFolderName, newFolderName, idAmuta) {
    let sql = `UPDATE pirsumim SET picture = REPLACE(picture,'amutot/${oldFolderName}/','amutot/${newFolderName}/') WHERE amuta_id =? `;
    return await db.execute(sql, [idAmuta]);
  }
  static async renameLogoPath(oldFolderName, newFolderName, idAmuta) {
    let sql = `UPDATE amutot SET logo = REPLACE(logo,'amutot/${oldFolderName}/','amutot/${newFolderName}/') WHERE id =?`;
    return await db.execute(sql, [idAmuta]);
  }

  static async resetPassword(amutaEmail, newPassword) {
    let sql = `UPDATE amutot SET password= ? WHERE email = ?`
    return await db.query(sql, [newPassword, amutaEmail])
  }
}
export default AmutotFunctions;