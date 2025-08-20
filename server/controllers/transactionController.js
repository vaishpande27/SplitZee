const { default: mongoose } = require('mongoose');
const Group = require('../models/Group')
const Transaction = require('../models/Transaction')

exports.addExpense_get = async (req, res) => {
  try {
    console.log(req.params.groupId)
    const group = await Group.findById(req.params.groupId)
      .populate("members", "name email")
      .populate("createdBy", "name email");

    if (!group) return res.status(404).json({ message: "Group not found" });

    res.json(group);
  } catch (err) {
    console.error("Error fetching group:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

exports.saveExpense_post = async (req, res) => {
  const groupId = req.params.groupId;
  const { description, amount, paidBy, participants } = req.body;
  try {
    const newTransaction = new Transaction({
      groupId,
      description,
      amount,
      paidBy,
      participants
      // date
    })
    const saveTransaction = await newTransaction.save();

    res.status(201).json({
      message: "transaction saved successfully!!"
    })
  }
  catch (err) {
    console.log("Error saving transaction:", err)
  }
}

exports.get_GroupInfo = async (req, res) => {
  const { groupId } = req.params;
  try {
    // 1. Find the group
    const group = await Group.findById(groupId)
      .populate("members", "name email")
      .populate("createdBy", "name email");

    res.status(200).json({
      group
    })
  }
  catch (err) {
    console.log("Error fetching GroupInfo", err);
  }
}

exports.get_Transactions = async (req, res) => {
  const { groupId } = req.params;
  console.log("Looking for groupId:", groupId);;
  try {
    // Find all transactions for that group
    const transactions = await Transaction.find({ groupId: new mongoose.Types.ObjectId(groupId) })
      .populate("paidBy", "name email")
      .populate("participants.userId", "name email");
    console.log("Found transactions:", transactions.length);
    res.status(200).json({
      transactions
    });
  }
  catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

exports.get_Balances = async (req, res) => {
  const { groupId } = req.params;
  try {
    // 1. Fetch group + transactions
    const group = await Group.findById(groupId).populate("members", "name email");
    if (!group) return res.status(404).json({ message: "Group not found" });

    const transactions = await Transaction.find({ groupId: new mongoose.Types.ObjectId(groupId) })
      .populate("paidBy", "name email")
      .populate("participants.userId", "name email");

    // 2. Compute net balances
    const balancesMap = {};
    group.members.forEach(m => {
      balancesMap[m._id] = { user: m, balance: 0 };
    });

    transactions.forEach(tx => {
      // Paid amount -> add to payer
      balancesMap[tx.paidBy._id].balance += tx.amount;

      // Each participant owes their share -> subtract
      tx.participants.forEach(p => {
        balancesMap[p.userId._id].balance -= p.share;
      });
    });

    // Convert to array
    const balances = Object.values(balancesMap);

    // 3. Settlement algorithm
    const settlements = [];
    const debtors = balances.filter(b => b.balance < 0);
    const creditors = balances.filter(b => b.balance > 0);

    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const settleAmount = Math.min(-debtor.balance, creditor.balance);

      settlements.push({
        from: debtor.user,
        to: creditor.user,
        amount: settleAmount
      });

      debtor.balance += settleAmount;
      creditor.balance -= settleAmount;

      if (debtor.balance === 0) i++;
      if (creditor.balance === 0) j++;
    }

    res.status(200).json({ balances, settlements });
  } catch (err) {
    console.error("Error calculating balances:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

