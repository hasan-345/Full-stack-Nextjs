"use client"
import React, {useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import {FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import {AxiosError} from "axios"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { ApiResponse } from '@/types/ApiResponse'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { signInValidation } from '@/Schema/signInSchema'
import { signIn } from 'next-auth/react'

function Page() {
 
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<z.infer<typeof signInValidation>>({
        resolver: zodResolver(signInValidation),
        defaultValues: {
          identifier: "",//it means user can give email or username
          password: ""
        },
      })

      const onSubmit = async(data: z.infer<typeof signInValidation>)=>{
        setIsSubmitting(true)

     try {
      //we are using next auth then method will be different
       const result =  await signIn("credentials",{
             redirect: false,
             identifier: data.identifier,
             password: data.password
         })  
 
 
         if (result?.error) {
             toast({
               title: "Login failed",
               description: "Invalid username/email or password",
               variant: "destructive"
             })
 
             setIsSubmitting(false)
         }
 
         if (result?.url) {
           setIsSubmitting(false)
           toast({
             title: "Login Successfully",
             description: "Successfully User Login.",
             variant: "default"
           })
 
           router.replace("/dashboard")
         }
     } catch (error) {
      console.log("error signin method",error);
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage =  axiosError.response?.data.message
            toast({
                title: "Login failed",
                description: errorMessage,
                variant: 'destructive'
            })
            setIsSubmitting(false) 
     }
         
        
    }  
 

  return (
    <div className=' pt-[150px] pb-[50px] flex justify-center items-center min-h-screen overflow-y-hidden overflow-x-hidden bg-black text-white'>
    <div className='w-full max-w-md md:p-8 p-5 space-y-8 bg-black border rounded-lg shadow-md relative z-[3] m-4'>

      
    <div className='absolute z-[0] w-[60%] h-[30%] -left-8 -top-10 right-0 pink__gradient overflow-hidden'/>
        <div className='absolute z-[1] w-[50%] h-[50%] -left-8 -top-9 right-0   blue__gradient  overflow-hidden'/>
        <div className='absolute z-[2] w-[50%] h-[25%] -left-8 -top-14 right-0 yellow__gradient  overflow-hidden'/>

        <div className='absolute z-[0] w-[60%] h-[30%] -bottom-10 -right-72 pink__gradient overflow-hidden'/>
        <div className='absolute z-[1] w-[50%] h-[50%] -bottom-9  -right-72   blue__gradient  overflow-hidden'/>
        <div className='absolute z-[2] w-[50%] h-[25%] -bottom-14 -right-72 dark__gradient  overflow-hidden'/>


        <div className='relative z-[2]'>
           <h1 className='text-slate-100 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Join Feedback Messages</h1>
           <p className='mb-4 text-slate-100'>Sign in to start your anonymous adventure</p>

    <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
            name="identifier"
            control={form.control}
            render={({ field }) => (
                <FormItem>
                <FormLabel>Username/Email</FormLabel>
                <FormControl>
                    <Input className='bg-transparent dark relative z-[2] border-2' placeholder="username" {...field}
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
                    <Input className='bg-transparent dark relative z-[2] border-2' placeholder="password" type='password' {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit" className='dark' aria-disabled={isSubmitting} >
                {isSubmitting? (
                <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin dark'/> Please wait...
                </>
                ):("Sign in")}
            </Button>
        </form>
    </FormProvider>

    <div className='text-center mt-4'>
        <p> Don not have an account <Link href="/sign-up" className='text-blue-800 hover:text-blue-800 underline'>Sign up</Link> </p>
    </div>
        </div>
    </div>
</div>
  )
}

export default Page