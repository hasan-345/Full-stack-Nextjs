"use client"
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { useSession,signOut } from 'next-auth/react'
import {User} from "next-auth"
import "../app/globals.css"

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
import Image from 'next/image'

function Navbar() {

    const {data: session} = useSession()
    const user:User = session?.user as User


  return (
    <div className='fixed top-0 w-full z-10 custom-bg'>
    <div className='max-w-[1600px] mx-auto'> 
    <div className='w-full p-3 h-[100px] px-4 py-0'>
        <div className='flex justify-between items-center w-full h-full'>
             <div>
                <Link href="/"> <Image src="/apna-logo.png" alt='logo'  className='w-[100px] h-[100px] object-cover' height={100} width={100}  /></Link>
             </div>

             {session &&  <h2 className='text-2xl font-normal text-slate-100 sm:block hidden'> Welcome {user?.username || user?.email} </h2> }
               
             <div>
                {session? (


                      <AlertDialog> 
                      <AlertDialogTrigger asChild>
                        <Button variant="default" className='dark'> Logout </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent >
                        <AlertDialogHeader>
                          <AlertDialogTitle >Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will logout your
                            account and after you will have to login.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel >Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={()=> signOut()} >Logout</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                      </AlertDialog>
                    ):(
                        <Link href={`/sign-in`}> <Button className='dark'>Login</Button></Link>
                )}
                   
             </div>  
        </div>
    </div>
    </div>
    </div>
  )
}

export default Navbar