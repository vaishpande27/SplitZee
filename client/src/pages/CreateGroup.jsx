import { useState } from 'react';
import axios from 'axios';

function CreateGroup() {
  const [groupname, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [members,setMembers] = useState([{name:'',email:''}])

  const handleAddMember =()=>{
    setMembers([...members,{name:'',email:''}])
  }

  const handleMemberChange = (index,field,value) =>{
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/create_group',
        {
          groupname,
          description,
          members
        },
        {
          withCredentials: true // ✅ this allows cookies (JWT) to be sent
        }
      );
      alert(`Group "${response.data.group.name}" created successfully!`);
      setGroupName('');
      setDescription('');
      setMembers([{ name: '', email: '' }]);
    } catch (err) {
      console.error('Error creating group:', err.response?.data || err.message);
      alert('Failed to create group.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Create New Group</h2>
      <form onSubmit={handleCreateGroup}>
        <div>
          <label>Group Name</label>
          <input
            type="text"
            value={groupname}
            onChange={(e) => setGroupName(e.target.value)}
            required
            placeholder="Enter group name"
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>

        <div>
          <label>Members</label>
          {members.map((member, idx) => (
            <div key={idx}>
              <input type="text" placeholder='Name' value={member.name} onChange={(e)=> handleMemberChange(idx,'name',e.target.value)} 
              required/>

              <input type="text" placeholder='Email' value={member.email} onChange={(e)=>handleMemberChange(idx,'email',e.target.value)}
              required />
            </div>
          ))}
          <button type='button' onClick={handleAddMember}>+Add Member</button>
        </div>
        <button type="submit">Create Group</button>
      </form>
    </div>
  );
}

export default CreateGroup;
