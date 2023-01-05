import express from 'express'
import AdminClass from '../../controllers/Admin.js';
import checkAuthAdmin from '../../middleware/authTokenAdmin.js';
const router = express.Router();

// בקשות API

router.post('/getAllAmutot',checkAuthAdmin, AdminClass.getAllAmutot);
router.post('/getNumOfPirsumim',checkAuthAdmin, AdminClass.getNumOfPirsumim);
router.post('/createAmuta',checkAuthAdmin, AdminClass.createAmuta);
router.put('/editAmuta',checkAuthAdmin, AdminClass.editAmuta);
router.delete('/deleteAmuta',checkAuthAdmin, AdminClass.deleteAmuta);
router.put('/enableOrDisableAmuta',checkAuthAdmin, AdminClass.enableOrDisableAmuta);

// control amutot pirsumim
router.post('/getAmutaPirsumim',checkAuthAdmin, AdminClass.getAmutaPirsumim);
router.post('/detailsAmuta',checkAuthAdmin, AdminClass.detailsAmuta);
router.delete('/deletePirsum',checkAuthAdmin, AdminClass.deletePirsum);
router.put('/finishPirsum',checkAuthAdmin, AdminClass.finishPirsum);

router.post('/renameFolderAmuta',checkAuthAdmin, AdminClass.renameFolderAmuta);

router.post('/resetPassword',checkAuthAdmin, AdminClass.resetAmutaPassword);


export default router;