import React from 'react';
import { useEffect,useState } from 'react';

function MyGroups() {
    const [groups, setGroups] = useState([]);
    useEffect(() => {
        // e.preventDefault();
        const fetchGroups = async () => {
            try {
                const response = await axios.get("http://localhost:5000/groups", {
                    withCredentials: true
                })
                setGroups(response.data);
            }
            catch (err) {
                console.error('Error fetching groups:', err.response?.data || err.message);
            }
        }

        fetchGroups();
    }, [])
     if (groups.length === 0) return <p>No groups found. Create a new one!</p>;

    return (
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
            <h2>My Groups</h2>
            {groups.map((group) => (
                <div key={group._id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px' }}>
                    <h3>{group.name}</h3>
                    <p>{group.description || "No description"}</p>
                    <p><strong>Members:</strong> {group.members.map(m => m.name).join(', ')}</p>
                </div>
            ))}
        </div>
    );
}

export default MyGroups;
