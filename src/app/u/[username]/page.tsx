"use client"
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { messageValidation } from '@/Schema/messageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Textarea } from "@/components/ui/textarea"


function PublicPage() {

   const params = useParams<{username: string}>()
   const [isLoading, setIsLoading] = useState(false)
   const {toast} = useToast()

   
   const form = useForm<z.infer<typeof messageValidation>>({
    resolver: zodResolver(messageValidation),
  })



   const sendMessage = async(data: z.infer<typeof messageValidation>)=>{
      setIsLoading(true)
      try {
        const response = await axios.post<ApiResponse>("/api/send-message",{
          content: data.content,
          username: params.username
        })

        toast({
          title: "Successfully",
          description: response.data.message
        })

        form.reset();
      } catch (error) {
        console.log("error signup method",error);
        const axiosError = error as AxiosError<ApiResponse>
        const errorMessage =  axiosError.response?.data.message
        toast({
            title: "Error while sending message failed",
            description: errorMessage,
            variant: 'destructive'
        })
      } finally{
        setIsLoading(false)
      }
   }

  return (
    <div className='pt-[150px] pb-[50px] flex justify-center items-start min-h-screen bg-black text-white'>
    <div className='w-full p-8 space-y-8 bg-black relative z-[3]'>

    <div className='absolute z-[0] w-[60%] h-[30%] -left-8 -top-10 right-0 pink__gradient overflow-hidden'/>
    <div className='absolute z-[1] w-[50%] h-[50%] -left-8 -top-9 right-0   blue__gradient  overflow-hidden'/>
    <div className='absolute z-[2] w-[50%] h-[25%] -left-8 -top-14 right-0 yellow__gradient  overflow-hidden'/>
        <div className='relative z-[2] max-w-[1600px] mx-auto'>
           <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Public Messages</h1>
           <p className='mb-4'> </p>

    <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(sendMessage)} className="space-y-5">
            <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
                <FormItem>
                <FormLabel>Send Anonymous Message to @{params.username}</FormLabel>
                <FormControl>

                <Textarea {...field} className='border-2 border-slate-300 bg-black' placeholder='Write your random messages' />
                   
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <Button className='dark'  type="submit" aria-disabled={isLoading} >
                {isLoading? (
                <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin'/> Please wait...
                </>
                ):("Send it")}
            </Button>
        </form>
    </FormProvider>
        </div>
    </div>
</div>
  )
}

export default PublicPage