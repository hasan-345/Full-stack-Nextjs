"use client"
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import {FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import axios, {AxiosError} from "axios"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { signUpValidation } from '@/Schema/signUpSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'


function Page() {
    const [username,setUsername] = useState("")
    const [usernameMessage,setUsernameMessage] = useState("")
    const [isCheckingUsername,setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    const { toast } = useToast()
    const router = useRouter()
    const debounced = useDebounceCallback(setUsername, 300)
    //it means when user write something in username field then function will be trigger after that time

    const form = useForm<z.infer<typeof signUpValidation>>({
        resolver: zodResolver(signUpValidation),
        defaultValues: {
          username: "",
          email: "",
          password: ""
        },
      })


    const onSubmit = async(data: z.infer<typeof signUpValidation>)=>{
        setIsSubmitting(true)

        try {
          const response = await axios.post<ApiResponse>("/api/signup",data)
           
          if (response.data.success) {
              toast({
                title: "Success",
                description: response.data.message,
                variant: 'default'
              })

                setIsSubmitting(false)
      
                router.replace(`/verify/${data.username}`)
                //it will redirect to this address
    
          }

          setIsSubmitting(false)
        } catch (error) {
            console.log("error signup method",error);
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage =  axiosError.response?.data.message
            toast({
                title: "Signup failed",
                description: errorMessage,
                variant: 'destructive'
            })
            setIsSubmitting(false)  
        }
    }  

    useEffect(()=>{
        ;(async () => {

            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage("")
                
                try {
                 const response = await axios.get(`/api/checkUsername?username=${username}`)
                 setUsernameMessage(response.data.message)
                } catch (error) {
                  const axiosError = error as AxiosError<ApiResponse>
                  setUsernameMessage(axiosError.response?.data.message ?? "Error checking Username")
                } finally{
                   setIsCheckingUsername(false)
                }
            }
          
        })()
    },[username])


  return (
    <div className='flex justify-center items-center bg-black pt-[150px] pb-[50px] text-white w-full min-h-screen overflow-y-hidden overflow-x-hidden'>
       

        <div className='w-full max-w-md md:p-8 p-5 space-y-8 h-auto bg-black bg-opacity-80 rounded-lg shadow-md border relative z-[2] m-4'>

        <div className='absolute z-[0] w-[60%] h-[30%] -left-8 -top-56 right-0 pink__gradient overflow-hidden'/>
        <div className='absolute z-[1] w-[50%] h-[50%] -left-8 -top-80 right-0   blue__gradient  overflow-hidden'/>
        <div className='absolute z-[2] w-[50%] h-[25%] -left-8 -top-80 right-0 yellow__gradient  overflow-hidden'/>

        <div className='absolute z-[0] w-[60%] h-[30%] -bottom-10 -right-72 pink__gradient overflow-hidden'/>
        <div className='absolute z-[1] w-[50%] h-[50%] -bottom-9  -right-72   blue__gradient  overflow-hidden'/>
        <div className='absolute z-[2] w-[50%] h-[25%] -bottom-14 -right-72 dark__gradient  overflow-hidden'/>
      


            <div className='relative z-[2]'>
               <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Join Feedback Messages</h1>
               <p className='mb-4'>Signup to start your anonymous adventure</p>

        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 h-auto">
                <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input className='bg-transparent dark relative z-[2] border-2' placeholder="username" {...field}
                        onChange={(e)=> {
                            field.onChange(e);
                            debounced(e.target.value)
                        }}
                        />
                       
                    </FormControl>
                    <div>
                    {isCheckingUsername? <Loader2 className='animate-spin'/>: <p className={`text-sm ${usernameMessage === "Username is unique"? "text-green-500": "text-red-500"}`}>{usernameMessage}</p>}
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input className='bg-transparent dark relative z-[2] border-2' placeholder="email" {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input  className='bg-transparent dark relative z-[2] border-2' placeholder="password" type='password' {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit"  className='dark' aria-disabled={isSubmitting} >
                    {isSubmitting? (
                    <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin'/> Please wait...
                    </>
                    ):("Sign up")}
                </Button>
            </form>
        </FormProvider>

        <div className='text-center mt-4'>
            <p> Already member <Link href="/sign-in" className='text-blue-800 hover:text-blue-800 underline'>Login</Link> </p>
        </div>
            </div>
        </div>
    </div>
  )
}

export default Page