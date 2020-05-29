import React, { useState, useEffect } from "react";
import queryString from 'query-string'; //Retrieve data from url
import io from "socket.io-client";      // React client 

//import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages'; 
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'localhost:5000';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search); // Returns data from url
    socket = io(ENDPOINT); // URL endpoint 
    setRoom(room);  
    setName(name)

    socket.emit('join', { name, room }, (error) => { // Emmiting different join event - > pass the payload -> call back
      if(error) {
        alert(error);
      }
    });

    return ()=>{
      socket.emit('disconnet')
      socket.off()
    }

  }, [ENDPOINT, location.search]);
  

  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
},[]);

 

  const sendMessage = (event) => {
    event.preventDefault(); // Prevents refresh of the page
    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      {/* <TextContainer users={users}/> */}
    </div>
  );
}

export default Chat;