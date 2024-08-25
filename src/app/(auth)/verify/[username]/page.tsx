"use client"
import { useToast } from '@/components/ui/use-toast'
import { verifyValidation } from '@/Schema/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {z}  from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

function Page() {
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const params = useParams<{username: string}>()
    const {toast} = useToast()


    const form = useForm<z.infer<typeof verifyValidation>>({
        resolver: zodResolver(verifyValidation)
      })


    const onSubmit = async(data: z.infer<typeof verifyValidation>)=>{
        setIsSubmitting(true)
        try {
           const response = await axios.post("/api/verifyCode",{
                username: params.username,
                code: data.otp
            })

            toast({
                title: "Success",
                description: response.data.message
            })

            router.replace("/sign-in")
        } catch (error) {
            console.log("error signup method",error);
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage =  axiosError.response?.data.message
            toast({
                title: "Verification failed",
                description: errorMessage,
                variant: 'destructive'
            })
            setIsSubmitting(false) 
        } finally{
            setIsSubmitting(false)
        }
    }  

  return (
    <div className=' flex justify-center items-start pt-[150px] pb-[50px] min-h-screen bg-black text-white overflow-hidden'>
        <div className='w-full max-w-md md:p-8 p-5 space-y-8 bg-black border rounded-lg shadow-md relative z-[3] m-4'>

        <div className='absolute z-[0] w-[60%] h-[30%] -left-8 -top-10 right-0 pink__gradient overflow-hidden'/>
        <div className='absolute z-[1] w-[50%] h-[50%] -left-8 -top-9 right-0   blue__gradient  overflow-hidden'/>
        <div className='absolute z-[2] w-[50%] h-[25%] -left-8 -top-14 right-0 yellow__gradient  overflow-hidden'/>
            <div className='relative z-[2]'>
               <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Verification</h1>
               <p className='mb-4'>OTP have been sent to your email</p>

        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                name="otp"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Verification OTP</FormLabel>
                    <FormControl>
                        <Input className='bg-transparent dark relative z-[2] border-2' placeholder="123456" {...field}
                        />
                       
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <Button className='dark'  type="submit" aria-disabled={isSubmitting} >
                    {isSubmitting? (
                    <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin'/> Please wait...
                    </>
                    ):("Validate")}
                </Button>
            </form>
        </FormProvider>
            </div>
        </div>
    </div>
  )
}

export default Page