"use client"
import React, { useCallback, useEffect, useState } from 'react'
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { MessageType } from '@/models/User.model'
import axios from 'axios'
import { useToast } from './ui/use-toast'
import { ApiResponse } from '@/types/ApiResponse'
  
type Message ={
    message: MessageType;
    onMessageDelete: (messageId: any)=> void;
}

function MessageCard({message, onMessageDelete}: Message) {

   const {toast} = useToast()
    const [dateCreatedAt, setdateCreatedAt] = useState("")
   const handleDelete = async()=>{
     const response =  await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
     
     toast({
        title: response.data.message || "Successfully deleted"
     })

     onMessageDelete(message._id)

   } 

   const formatChanger = useCallback(()=>{

    const date = new Date(message.createdAt) 
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'long' }); // Full month name
    const day = String(date.getDate()).padStart(2, '0');
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight (0 should be 12)

    const formattedDate = `${month} ${day}, ${year}, ${hours}:${minutes}:${seconds} ${ampm}`;


     setdateCreatedAt(formattedDate)
     console.log(formattedDate);
     
   },[message])

   // eslint-disable-next-line react-hooks/exhaustive-deps
   useEffect(()=>{
    if (message) {
      formatChanger()
    } 
   },[message,formatChanger])

  return (
    <div>
        <Card className='max-w-md dark pb-5 relative z-[3]'>
            <CardHeader>
              <div className='flex items-center justify-between gap-3'>
            <CardTitle className='leading-7'> {message.content} </CardTitle>

         <div className='m-2'>
            <AlertDialog> 
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className='bg-red-600'> <X className='w-5 h-5'/> </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
    </div>


            <CardDescription> {dateCreatedAt} </CardDescription>
            </CardHeader>
        </Card>
  </div>
  )
}

export default MessageCard