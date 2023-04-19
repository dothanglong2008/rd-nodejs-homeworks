const {
  register,
  login,
  getUserProfileInfo,
  changeUserPassword,
  deleteUserProfile,
  forgotPassword,
  uploadProfilePicture,
} = require('../controllers/userControllers');

const {verifyToken} = require('../middlewares/authenMiddlewares');
const {
  viewUserAssignedLoads,
  iterateState,
  addLoad,
  viewLoads,
  postLoadById,
  viewLoadShippingInfo,
} = require('../controllers/loadConrollers');
const {
  addTruck,
  viewTrucks,
  viewTruckById,
  assignTruckById,
  updateTruckById,
  deleteTruckById,
} = require('../controllers/truckControllers');

const express = require('express');
const {validateRegisterRequest,
  validateLoginRequest,
  validateAddTruckRequest,
  validateUpdateTruckRequest,
  validateViewLoadRequest} = require('../middlewares/validateRequest');
// eslint-disable-next-line new-cap
const router = express.Router();
const multer = require('multer');

router.post('/api/auth/register', validateRegisterRequest, register);

router.post('/api/auth/login', validateLoginRequest, login);

router.post('/api/auth/forgot_password', forgotPassword);

router.get('/api/users/me', verifyToken, getUserProfileInfo);

router.patch('/api/users/me/password', verifyToken, changeUserPassword);
multer({dest: 'uploads'});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({storage: storage});

router.post('/api/users/me',
    upload.single('avatar'),
    uploadProfilePicture);

router.delete('/api/users/me', verifyToken, deleteUserProfile);

router.post('/api/trucks', verifyToken, validateAddTruckRequest, addTruck);

router.get('/api/trucks', verifyToken, viewTrucks);

router.get('/api/trucks/:id', verifyToken, viewTruckById);

router.post('/api/trucks/:id/assign', verifyToken, assignTruckById);

router.put('/api/trucks/:id', verifyToken,
    validateUpdateTruckRequest, updateTruckById);

router.delete('/api/trucks/:id', verifyToken, deleteTruckById);

router.get('/api/loads/active', verifyToken, viewUserAssignedLoads);

router.patch('/api/loads/active/state', verifyToken, iterateState);

router.post('/api/loads', verifyToken, addLoad);

router.get('/api/loads', verifyToken, validateViewLoadRequest, viewLoads);

router.post('/api/loads/:id/post', verifyToken, postLoadById);

router.get('/api/loads/:id/shipping_info', verifyToken,
    viewLoadShippingInfo);

module.exports = router;
