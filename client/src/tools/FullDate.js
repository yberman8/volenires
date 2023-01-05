import RequestOptions from '../tools/RequestOptions.js'

 class FullDate {
    constructor() {
    }

    static async dateCalc(date_create) {
        // קבלת תאריך לועזי
        let today = new Date(date_create);
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;
        // קבלת תאריך עברי
       return await fetch(`https://www.hebcal.com/converter?cfg=json&gy=${yyyy}&gm=${mm}&gd=${dd}&g2h=1`).then((response) => {
          return response.json();
        }).then((jsonObject) => {
           return today + " - " + jsonObject.hebrew
        });
      }
   
   
  
   
}

export default FullDate;