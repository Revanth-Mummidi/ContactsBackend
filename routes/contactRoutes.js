const express = require("express");
const router = express.Router();

const {getContact,getContacts,putContact,deleteContact,createContact}=require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandle");


router.use(validateToken);

router.route('/').get(getContacts).post(createContact);

router.route('/:id').get(getContact).put(putContact).delete(deleteContact);



module.exports = router;