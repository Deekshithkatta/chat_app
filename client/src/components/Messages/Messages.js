//@ts-ignore 
import React from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import Message from '../Message/message'

import './messages.css'

const Messages = ({messages,name})=>(
  
       <ScrollToBottom>
           {
               messages.map((message,i)=><div><Message message={message} name={name}/></div>)
           }
       </ScrollToBottom>
    
)

export default Messages