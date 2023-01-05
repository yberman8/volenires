import path from 'path'
import fs from 'fs'

class Upload {
  constructor() {
  }

  static async uploadImage(req, res) {
    let myFile = req.files.my;
    let emailAmuta = req.body.emailAmuta;
    let picture_or_logo = req.body.picture_or_logo;
    let pirsum_id = req.body.pirsum_id;
     let serverHost = req.rawHeaders[1];
    let extensionsArry = [".png",".jpg",".jpeg",".svg"];
    let extensionFile = path.extname(myFile.name);
    // בדיקה האם הקובץ הוא מסוג תמונה
    if (extensionsArry.includes(extensionFile)) {
    // בדיקה אם המשקל של הקובץ מעל 5 מב
    if (myFile.size <= 1024 * 1024 * 5) {

        let dir = `public/assets/amutot/${emailAmuta}/`;
        let nestedDir1 = `public/assets/amutot/${emailAmuta}/logo/`;
        let nestedDir2 = `public/assets/amutot/${emailAmuta}/pictures/`;

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
            fs.mkdirSync(nestedDir1);
            fs.mkdirSync(nestedDir2);
        }

         let dynamicDir = `public/assets/amutot/${emailAmuta}/pictures/${pirsum_id}/`;
        if (pirsum_id) {
            picture_or_logo += pirsum_id + "/"
            if (!fs.existsSync(dynamicDir)) {
                fs.mkdirSync(dynamicDir);     
            }
        }
        myFile.mv("public/assets/amutot/" + emailAmuta + "/" + picture_or_logo  + myFile.name, (error) => {
            if (error) {
                return res.status(400).json({ msg: "error" + error })
            }
            let imageLink = "http://" + serverHost + "/assets/amutot/" + emailAmuta + "/" + picture_or_logo  + myFile.name;

            res.json({ msg: "upload route",link1: imageLink})
        })
    }else{
        return res.status(400).json({ msg: "file too big, max 5mb" })
    }
    }else{
        return res.status(400).json({ msg: "file must be image, png or jpg" })
    }

  };



}


export default Upload;

 