import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MyGroups() {
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get("http://localhost:5000/groups", {
                    withCredentials: true
                });
                setGroups(response.data);
            } catch (err) {
                console.error('Error fetching groups:', err.response?.data || err.message);
            }
        };
        fetchGroups();
    }, []);

    if (groups.length === 0) return <p>No groups found. Create a new one!</p>;

    return (
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
            <h2>My Groups</h2>
            {groups.map((group) => (
                <div key={group._id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px' }}>
                    <h3>{group.name}</h3>
                    <p>{group.description || ""}</p>
                    <p><strong>Total Members:</strong> {group.members.length}</p>
                    <p><strong>Created At:</strong> {new Date(group.
                        createdAt).toLocaleString()}</p>
                    <p><strong>Created By:</strong> {group.
                        createdBy?.name || "Unknown"}</p>
                    <div style={{ marginTop: '10px' }}>
                        <button onClick={() => navigate(`/groups/${group._id}/transactions`)}>View Transactions</button>
                        <button style={{ marginLeft: '10px' }} onClick={() => console.log("Leave group", group._id)}>Leave Group</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MyGroups;
