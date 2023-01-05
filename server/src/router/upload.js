import express from 'express'
const router = express.Router();
import UploadClass from '../../controllers/Upload.js'
import checkAuth from '../../middleware/authToken.js';

router.post('/',checkAuth,UploadClass.uploadImage);

export default router;