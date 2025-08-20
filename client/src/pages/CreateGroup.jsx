import { useState } from 'react';
import axios from 'axios';
import '../assets/CSS/CreateGroup.css';

function ModernCreateGroup() {
  const [groupname, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([{ name: '', email: '' }]);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleAddMember = () => {
    setMembers([...members, { name: '', email: '' }]);
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };
  const handleRemoveMember = (index) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/groups/create_group',
        {
          groupname,
          description,
          members
        },
        {
          withCredentials: true
        }
      );
      alert(`Group "${response.data.group.name}" created successfully!`);
      setGroupName('');
      setDescription('');
      setMembers([{ name: '', email: '' }]);
      setSelectedFile(null);
    } catch (err) {
      console.error('Error creating group:', err.response?.data || err.message);
      alert('Failed to create group.');
    }
  };

  return (
    <div className="modern-create-group">
      {/* Left Section */}
      <div className="left-section">
        <div className="file-upload-section">
          <input
            type="file"
            id="group-image"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <label htmlFor="group-image" className="file-upload-btn">
            {selectedFile ? `Selected: ${selectedFile.name}` : 'Choose File | No file chosen'}
          </label>
        </div>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <form onSubmit={handleCreateGroup}>
          {/* Group Name Section */}
          <div className="group-name-section">
            <div className="section-header">Start a New Group</div>
            <h2>My group shall be called...</h2>
            <input
              type="text"
              value={groupname}
              onChange={(e) => setGroupName(e.target.value)}
              className="group-name-input"
              placeholder="Enter group name"
              required
            />
          </div>

          {/* Description Section */}
          <div className="description-section">
            <div className="section-header">Description</div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="description-textarea"
              placeholder="Optional description for your group..."
            />
          </div>

          {/* Members Section */}
          <div className="members-section">
            <div className="members-header">
              <div className="section-header">Group Members</div>
            </div>
            <p style={{ color: '#6b7280', fontSize: '16px', margin: '7px 5px 15px 0' }}>
              Tip: Lots of people to add? Send your friends an invite link.
            </p>

            <div className="members-list">
              {/* Dynamic Members */}
              {members.map((member, idx) => (
                <div key={idx} className="member-item">
                  <div className="member-avatar member">
                    {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div className="member-info">
                    <input
                      type="text"
                      placeholder="Name"
                      value={member.name}
                      onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                      className="member-name-input"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email address (optional)"
                      value={member.email}
                      onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                      className="member-email-input"
                      required
                    />
                  </div>
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(idx)}
                      className="member-remove"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddMember}
              className="add-person-btn"
            >
              + Add a person
            </button>
          </div>

          <button type="submit" className="create-btn">
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModernCreateGroup;