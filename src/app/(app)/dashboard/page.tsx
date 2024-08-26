"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { Separator } from "@/components/ui/separator"
import { MessageType } from '@/models/User.model'
import { useToast } from '@/components/ui/use-toast'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { acceptValidation } from '@/Schema/acceptMessageSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Loader2, RefreshCcw } from 'lucide-react'
import MessageCard from '@/components/MessageCard'
import { Input } from '@/components/ui/input'


function Page() {

  const [messages,setMessages] = useState<MessageType[]>([]) //stores all messages
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading,setIsSwitchLoading] = useState(false)

  const {toast} = useToast()

  const handleDelete = (messageId: string)=>{
     setMessages(messages.filter((message)=> message._id !== messageId)) //it just delete message in UI
  }

  const {data: session} = useSession() //remember when we store data in session

  const user = session?.user

  const form = useForm({
    resolver: zodResolver(acceptValidation)
  })

  const {register,watch,setValue} = form

  const acceptMessage = watch("acceptMessages")

  const fetchAcceptMessages = useCallback(
   async () => {
      setIsSwitchLoading(true)

      try {
         const response = await axios.get<ApiResponse>("/api/accept-messages")
         setValue("acceptMessages",response.data.isAcceptingMessages)
      } catch (error) {
        console.log("error signup method",error);
        const axiosError = error as AxiosError<ApiResponse>
        const errorMessage =  axiosError.response?.data.message
        toast({
            title: "Fetching setting failed",
            description: errorMessage || "Failed to fetch message setting",
            variant: 'destructive'
        })
      } finally{
        setIsSwitchLoading(false)
      }

    },
    [setValue, toast])
  

  const fetchMessages = useCallback(
   async (refresh: boolean = false) => {
      setIsLoading(true)
      setIsSwitchLoading(true)

      try {
        const response =  await axios.get<ApiResponse>("/api/get-messages")
        setMessages(response.data.messages || []);

        if(refresh) {
           toast({
            title: "Refreshed Messages",
            description: "Showing latest messages."
           })
        }

      } catch (error) {
        console.log("error signup method",error);
        const axiosError = error as AxiosError<ApiResponse>
        const errorMessage =  axiosError.response?.data.message
        toast({
            title: "Error while fetch Messages",
            description: errorMessage || "Failed to fetch message setting",
            variant: 'destructive'
        })
      } finally{
        setIsSwitchLoading(false)
        setIsLoading(false)
      }
    },
    [setMessages,setIsLoading, toast])
  
  useEffect(()=>{
     if (!session || !session.user) return
     fetchMessages()
     fetchAcceptMessages()
  },[fetchAcceptMessages, session,fetchMessages])


  const handleSwitchChange = async()=>{
     try {
      const response =  await axios.post<ApiResponse>("/api/accept-messages",{
        acceptMessages: !acceptMessage
      })

      setValue("acceptMessages",!acceptMessage)

      toast({
        title: response.data.message,
        variant: "default"
      })
     } catch (error) {
      console.log("error change setting of accept messages",error);
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage =  axiosError.response?.data.message
      toast({
          title: "error change setting of accept messages",
          description: errorMessage || "error change setting of accept messages",
          variant: 'destructive'
      })
     }
  }

   
  const baseUrl =  typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
  const profileUrl = `${baseUrl}/u/${user?.username}`

  const copyClipboard = ()=>{
     navigator.clipboard.writeText(profileUrl)
     toast({
      title: "Successfully Copied URL",
      variant: "default"
     })
  }

   if (!session || !session.user) {
      return <div className='text-slate-100' >
          <h2>Please login</h2>
      </div>
   }

  return (
    <div className='pt-[150px] pb-[50px] bg-black p-6 w-full  relative z-[3] '>

      <div className='max-w-[1600px] mx-auto'>

<div className='absolute z-[0] w-[60%] h-[30%] -left-8 -top-10 right-0 pink__gradient overflow-hidden'/>
    <div className='absolute z-[1] w-[50%] h-[50%] -left-8 -top-9 right-0   blue__gradient  overflow-hidden'/>
    <div className='absolute z-[2] w-[50%] h-[25%] -left-8 -top-14 right-0 yellow__gradient  overflow-hidden'/>
   
      <h1 className='text-4xl font-bold mb-4 text-slate-100 relative z-[3]'>User Dashboard</h1>
      <div className='mb-4'>
        <h2 className='text-slate-100 my-4 relative z-[3]'>Copy your Unique Link</h2> {" "}
        <div className='flex items-center relative z-[3]'>
          <Input type="text" value={profileUrl} readOnly className='w-full p-2 mr-2 text-md bg-transparent border-2 text-slate-100 border-slate-400' />
          <Button className='dark' onClick={copyClipboard} > Copy </Button>
        </div>
      </div>

       <div className='pb-4 text-slate-100 flex items-center relative z-[3]'>
         <Switch
         className='dark'
          {...register("acceptMessages")}
          checked={acceptMessage}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
         />

         <span className='ml-2 relative z-[3]'>
           Accept Messages: {acceptMessage? "On": "Off"} 
         </span>
       </div>

         <Separator className="bg-slate-700 relative z-[3]"/>

         <Button
         variant="outline" 
         className='mt-4 dark text-slate-100 border-2 border-slate-600 relative z-[3]'
          onClick={(e)=> {
          e.preventDefault();
          fetchMessages(true);
         }}>
            {isLoading? <Loader2 className='w-4 h-4 animate-spin'/>: <RefreshCcw className='h-4 w-4'/> }

         </Button>

         <div className='mt-4 flex flex-wrap md:w-fit w-full gap-6'>
            {messages.length > 0 ? (
              messages.map((message)=> (        
                <MessageCard
                 key={message._id as string} 
                 message={message} 
                 onMessageDelete={handleDelete} />
              ))
            ):(
              <p>No messages to display</p>
            )}
         </div>
         </div>
    </div>
  )
}

export default Page