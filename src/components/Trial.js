import { collection, getDocs,addDoc } from 'firebase/firestore';
import React from 'react';
import { useState, useEffect } from 'react';
import { db } from '../firebase-config';

const Trial = () => {
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState(0);

  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "admins");

  const createUser = async () => {
    await addDoc(usersCollectionRef,{username:newName,password:newPassword});
  }

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      console.log(users);
    };
    getUsers();
  }, [])

  return (
    <div>
      <input
        placeholder='username'
        onChange={(event) => {
          setNewName(event.target.value);

        }} />
      <input
        placeholder='age'
        type='password'
        onChange={(event) => {
          setNewPassword(event.target.value);
        }}
      />
      <button onClick={createUser}>Create User</button>
      {
        users.map((user) => {
          return (
            <div>
              <div >Name: {user.username}</div>
              <div >password: {user.password}</div>
            </div>
          )
        })
      }
    </div>
  )
}

export default Trial
