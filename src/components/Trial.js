import { collection, getDocs } from 'firebase/firestore';
import React from 'react';
import { useState,useEffect } from 'react';
import { db } from '../firebase-config';

const Trial = () => {
    const [users,setUsers]=useState([]);
    const usersCollectionRef=collection(db,"admins");
    useEffect(() => {
      const getUsers = async() => {
        const data= await getDocs(usersCollectionRef);
        setUsers(data.docs.map((doc)=>({...doc.data(),id:doc.id})));
        console.log(users);
      };
      getUsers();
    }, [])
    
  return (
    <div>
      {
        users.map((user)=>{
            return(
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
