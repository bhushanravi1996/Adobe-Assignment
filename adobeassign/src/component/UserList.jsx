import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', bio: '',email:"" });
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/users')
      .then(response => setUsers(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleCreateUser = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3001/users', newUser)
      .then(response => {
        setUsers(users.concat(response.data));
        setNewUser({ name: '', bio: '',email:""  });
      })
      .catch(error => console.log(error));
  };

  const handleDeleteUser = (userId) => {
    axios.delete(`http://localhost:3001/users/${userId}`)
      .then(() => setUsers(users.filter(u => u.id !== userId)))
      .catch(error => console.log(error));
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setNewUser({ name: user.name, bio: user.bio, email: user.email });
  };

  const handleUpdateUser = (event) => {
    event.preventDefault();
    axios.put(`http://localhost:3001/users/${editUser.id}`, newUser)
      .then(response => {
        const updatedUsers = users.map(u => u.id === response.data.id ? response.data : u);
        setUsers(updatedUsers);
        setNewUser({ name: '', bio: '',email:""  });
        setEditUser(null);
      })
      .catch(error => console.log(error));
  };

  return (
    <div>
      <h2>User List</h2>
      <div>
        {users.map(user =>
          <div key={user.id} style={{display: "grid",gridTemplateColumns: "1fr 1fr 1fr 1fr"}}>
            <div>
               <div>{user.name}</div>
               <div>{user.email}</div>
               <div>{user.bio}</div>
            </div>
            <div>
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              <button onClick={() => handleEditUser(user)}>Edit</button>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={editUser ? handleUpdateUser : handleCreateUser}>
        <h3>{editUser ? 'Edit User' : 'Create User'}</h3>
        <label>Name: </label>
        <input type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
        <br />
        <label>Email: </label>
        <input type="text" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
        <br />
        <label>Bio: </label>
        <input type="text" value={newUser.bio} onChange={(e) => setNewUser({ ...newUser, bio: e.target.value })} />
        <br />
        <button type="submit">{editUser ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
};

export default UserList;
