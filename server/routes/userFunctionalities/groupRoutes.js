const groupController = require('../../controllers/groupController')
const express = require('express')
const { requireAuth } = require('../../middlewares/authmiddleware')
const transactionController = require('../../controllers/transactionController')
const router = express.Router()


router.post('/create_group',requireAuth,groupController.create_group)
router.get('/', requireAuth, groupController.get_groups);

router.get("/:groupId/add-expense", requireAuth,transactionController.addExpense_get);
router.post("/:groupId/transactions",requireAuth,transactionController.saveExpense_post);
router.get("/:groupId",requireAuth,transactionController.get_GroupInfo);
router.get("/:groupId/transactions",requireAuth,transactionController.get_Transactions);
router.get("/:groupId/balances", requireAuth, transactionController.get_Balances);


module.exports = router;

