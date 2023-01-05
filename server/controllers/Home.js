import fs from "fs";
import fetch from "node-fetch";
import db from '../database/db.js';
import HomeFunctions from '../models/HomeFunctions.js';


class Home {
  constructor() {
  }

  // API


  static async getAllPirsumim(req, res) {
    try {
      const [users, _] = await HomeFunctions.findAll();
      for (let i = 0; i < users.length; i++) {
        users[i].password = ""
      }
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
    }
  };

  static async getPirsumimFiltered(req, res) {

    try {
      const [users, _] = await HomeFunctions.findAllFiltered(req.body);
      for (let i = 0; i < users.length; i++) {
        users[i].password = ""
      }
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
    }
  };

  static async getSinglePirsumim(req, res) {
    try {
      const [users, _] = await HomeFunctions.findOne(req.body);
      for (let i = 0; i < users.length; i++) {
        users[i].password = ""
      }
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
    }
  };

  static async checkIfAdmin(req, res) {

    try {
      const [users, _] = await HomeFunctions.checkIfAdmin(req.body.id);
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
    }
  };


}

export default Home;