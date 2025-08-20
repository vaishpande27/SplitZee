import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function Transactions() {
  const { groupId } = useParams();
  const [showmodel, setShowmodel] = useState(false);
  const [showSplitOptions, setShowSplitOptions] = useState(false);
  // const [date, setDate] = useState(new Date());

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);

  const [members, setMembers] = useState([]);
  const [group, setGroup] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [splits, setSplits] = useState([]);
  const [paidBy, setPaidBy] = useState("");
  const [transactions, setTransactions] = useState([]);

  const [balances, setBalances] = useState([]);
  const [settlements, setSettlements] = useState([]);

  // open modal
  const addExpense = () => setShowmodel(true);

  // toggle split section
  const handleSplits = () => setShowSplitOptions(true);

  // select/deselect participants
  const handleCheckboxChange = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  // split equally
  const handleEqualSplit = () => {
    if (selectedMembers.length === 0)
      return alert("Select at least one participant");
    const share = Number(amount) / selectedMembers.length;
    const updated = selectedMembers.map((id) => ({ userId: id, share }));
    setSplits(updated);
  };

  // manual entry
  const handleSplitChange = (memberId, share) => {
    setSplits((prev) => {
      const updated = prev.filter((s) => s.userId !== memberId);
      return [...updated, { userId: memberId, share: Number(share) }];
    });
  };

  // fetch members & transactions
  const fetchGroupInfo = async () => {
    try {
      const res = await axios.get(`https://splitzee.onrender.com/groups/${groupId}`, {
        withCredentials: true
      })
      // console.log(res.data)
      setGroup(res.data.group);
      console.log("groups:", res.data.group)
      setMembers(res.data.group.members || []);
    }
    catch (err) {
      console.log("Error fetching GroupInfo:", err)
    }
  }
  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`https://splitzee.onrender.com/groups/${groupId}/transactions`, {
        withCredentials: true
      });
      // console.log(res.data.transactions);
      setTransactions(res.data.transactions || []);

    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };
  const fetchBalances = async () => {
    try {
      const res = await axios.get(`https://splitzee.onrender.com/groups/${groupId}/balances`, {
        withCredentials: true
      });
      setBalances(res.data.balances || []);
      setSettlements(res.data.settlements || []);
    } catch (err) {
      console.error("Error fetching balances:", err);
    }
  };

  useEffect(() => {
    fetchGroupInfo();
    fetchTransactions();
    fetchBalances();
  }, [groupId])
  // save expense
  const handleSave = async () => {
    const totalSplit = splits.reduce((sum, s) => sum + s.share, 0);
    if (totalSplit !== Number(amount)) {
      alert("Split amounts must equal total expense");
      return;
    }
    try {
      await axios.post(
        `http://localhost:5000/groups/${groupId}/transactions`,
        {
          description,
          amount,
          paidBy,
          participants: splits,
        },
        { withCredentials: true }
      );

      alert("Expense added!");
      setShowmodel(false);

      // reset form
      setDescription("");
      setAmount(0);
      setPaidBy("");
      setSelectedMembers([]);
      setSplits([]);
      setShowSplitOptions(false);

      // refresh transactions
      fetchTransactions();
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  };

  return (
    <div>
      <h1>Transactions for {group?.name || '...'}</h1>

      <div style={{ maxWidth: "600px", margin: "auto" }}>
        <h2>Transactions</h2>
        {transactions.length === 0 ? (
          <p>No Transactions yet!</p>
        ) : (
          <ul>
            {transactions.map((t) => (
              <li key={t._id} style={{ marginBottom: "10px" }}>
                <strong>{t.description}</strong> — ₹{t.amount} <br />
                Paid by: {members.find((m) => m._id === t.paidBy?._id)?.name || "Unknown"}
                <br />
                Split between:{" "}
                {t.participants.map((p) => {
                  const member = members.find((m) => m._id === p.userId);
                  return (
                    <span key={p.userId?._id || p.userId}>
                      {member?.name} (₹{p.share}){" "}
                    </span>
                  );
                })}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ maxWidth: "600px", margin: "auto", marginTop: "20px" }}>
  <h2>Balances</h2>
  {balances.length === 0 ? (
    <p>No balances yet</p>
  ) : (
    <ul>
      {balances.map(b => (
        <li key={b.user._id}>
          {b.user.name}: {b.balance > 0 ? `Gets ₹${b.balance}` : b.balance < 0 ? `Owes ₹${Math.abs(b.balance)}` : "Settled"}
        </li>
      ))}
    </ul>
  )}

  <h2>Settlement Plan</h2>
  {settlements.length === 0 ? (
    <p>Everything is settled 🎉</p>
  ) : (
    <ul>
      {settlements.map((s, idx) => (
        <li key={idx}>
          {s.from.name} → {s.to.name}: ₹{s.amount}
        </li>
      ))}
    </ul>
  )}
</div>

      <button onClick={addExpense}>Add Expense</button>

      {showmodel && (
        <div className="modal-overlay">
          <h2>Add an Expense</h2>
          <input
            type="text"
            placeholder="Enter a Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div>
            {/* <label>Select Date:</label>
          <Calendar value={date} onChange={setDate} /> */}
          </div>
          {/* Paid By */}
          <div>
            <label>Paid By: </label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
            >
              <option value="">-- Select Member --</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleSplits}>Split Between</button>
          {showSplitOptions && (
            <div>
              <h3>Select Participants:</h3>
              {members.map((m) => (
                <div key={m._id}>
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(m._id)}
                    onChange={() => handleCheckboxChange(m._id)}
                  />
                  <label>{m.name}</label>
                </div>
              ))}

              {/* Equal split option */}
              <button onClick={handleEqualSplit}>Split Equally</button>

              {/* Manual splits only for selected members */}
              {selectedMembers.length > 0 && (
                <div>
                  <h4>Custom Shares:</h4>
                  {selectedMembers.map((id) => {
                    const member = members.find((m) => m._id === id);
                    const existing = splits.find((s) => s.userId === id);
                    return (
                      <div key={id}>
                        <label>{member?.name}</label>
                        <input
                          type="number"
                          placeholder="Enter share"
                          value={existing?.share || ""}
                          onChange={(e) =>
                            handleSplitChange(id, e.target.value)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <button onClick={handleSave}>Save Expense</button>
          <button onClick={() => setShowmodel(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default Transactions;
