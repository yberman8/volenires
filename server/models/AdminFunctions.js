import db from "../database/db.js";
import bcrypt from 'bcrypt';
import joi from "joi"

class AdminFunctions {
  constructor() { }

  static validAddAmuta(body) {
    let userSchema = joi.object({
      email: joi.string().required().email().messages({'string.email': 'Email error',}),
      phone: joi.string().trim(),
      
    });
    return userSchema.validate(body)
  }

  static async checkIfAdmin(userId) {
    let sql = `SELECT is_super_manager FROM amutot WHERE id = ?`;
    return await db.query(sql,[userId])
  }

  static async findAll() {
  
    let sql = 'SELECT * FROM amutot';
    return await db.execute(sql);
  }

  static async getNumOfPirsumim() {
    let sql = "SELECT amuta_id, COUNT(*) AS count_of_pirsumim FROM pirsumim GROUP BY pirsumim.amuta_id";
   return await db.execute(sql);
 }

  static async save(newData) {

    newData.password = await bcrypt.hash(newData.password.toString(), 10);

    let sql = `INSERT INTO amutot (name, phone, email,notes,password) VALUES (?,?,?,?,?)`;

    return await db.query(sql, [newData.name, newData.phone, newData.email, newData.notes, newData.password]);
  }

  static async update(newData) {
   let sql = `UPDATE amutot SET name=?,phone=?,email=?,notes=? WHERE id = ?`;
        return await db.query(sql, [newData.name, newData.phone, newData.email, newData.notes, newData.id]);
  }

  static async delete(id) {
   let sql =`DELETE FROM amutot WHERE id = ?`;
    return await db.query(sql,[id]);
  }

  static async changeStatus(details) {
    let sql = `UPDATE amutot SET status=? WHERE id = ?`;
    return await db.query(sql,[details.status,details.id]);
  }

  static async detailsAmuta(amutaId) {

    let sql = `SELECT * FROM amutot WHERE id = ?`;
    return await db.query(sql,[amutaId]);

  }

        // control amutot pirsumim

  static async getAmutaPirsumim(details) {
    if (details.status !== "הכל") {
      let sql = `SELECT * FROM pirsumim WHERE amuta_id = ? AND status_pirsum = ?`;
      return await db.query(sql,[details.amutaId,details.status]);
    } else {
      let sql = `SELECT * FROM pirsumim WHERE amuta_id = ?`;
      return await db.query(sql,[details.amutaId]);
    }
  }

  static async deletePirsum(pirsum_id) {
    console.log(pirsum_id);
    let sql = `DELETE FROM pirsumim WHERE id_pirsum = ?`;
    return await db.execute(sql,[pirsum_id]);
  }

  static async finishPirsum(id_pirsum) {
    let sql = `UPDATE pirsumim SET status_pirsum= ? WHERE id_pirsum = ?`;
    return await db.execute(sql,["הסתיימו",id_pirsum]);
  }
  
  static async renameImagesPath(oldFolderName,newFolderName) {
    let sql = `UPDATE pirsumim SET picture = REPLACE(picture,'amutot/${oldFolderName}/','amutot/${newFolderName}/')`;
    return await db.execute(sql);
  }
  static async renameLogoPath(oldFolderName,newFolderName) {
    let sql = `UPDATE amutot SET logo = REPLACE(logo,'amutot/${oldFolderName}/','amutot/${newFolderName}/')`;
    return await db.execute(sql);
  }

  static async resetAmutaPassword(newPassword,userId) {
    let sql = `UPDATE amutot SET password= ? WHERE id = ?`
    return await db.query(sql,[newPassword,userId])
  }
}
export default AdminFunctions;

