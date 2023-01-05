import db from "../database/db.js";

class HomeFunctions {
    constructor() { }

    static async findAll() {
        let sql = 'SELECT * FROM pirsumim,amutot WHERE amutot.id = pirsumim.amuta_id';
        return await db.execute(sql);
    }

    
    static async findAllFiltered(detailsFilter) {

        let sql;
        if (detailsFilter.status !== "הכל" && detailsFilter.zone !== "הכל") {
            sql = `SELECT * FROM pirsumim JOIN amutot WHERE amutot.id = pirsumim.amuta_id
           AND pirsumim.status_pirsum = '${detailsFilter.status}' AND pirsumim.zone = '${detailsFilter.zone}'`;
        }
        if (detailsFilter.status === "הכל" && detailsFilter.zone === "הכל") {
            sql = `SELECT * FROM pirsumim JOIN amutot WHERE amutot.id = pirsumim.amuta_id`;
        }
        if (detailsFilter.status === "הכל" && detailsFilter.zone !== "הכל") {
            sql = `SELECT * FROM pirsumim JOIN amutot WHERE amutot.id = pirsumim.amuta_id
             AND pirsumim.zone = '${detailsFilter.zone}'`;
        }
        if (detailsFilter.status !== "הכל" && detailsFilter.zone === "הכל") {
            sql = `SELECT * FROM pirsumim JOIN amutot WHERE amutot.id = pirsumim.amuta_id
             AND pirsumim.status_pirsum = '${detailsFilter.status}'`;
        }
        return await db.execute(sql);
    }

    static async findOne(data) {
        let sql = 'SELECT * FROM pirsumim,amutot WHERE amutot.id = pirsumim.amuta_id AND pirsumim.id_pirsum = ?';
        return await db.execute(sql,[data.pirsum_id]);
    }

    static async checkIfAdmin(id) {
        let sql = 'SELECT is_super_manager AS manager FROM amutot WHERE id = ?';
        return await db.execute(sql,[id]);
    }

}
export default HomeFunctions;