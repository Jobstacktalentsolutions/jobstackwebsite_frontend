'use client';
import React, { useState } from 'react'
import AuthPageLayout from '@/app/components/authPageLayout'
import Input from '@/app/components/input'
import Button from '@/app/components/button'
import { Mail } from 'lucide-react'


const Page = () => {
    const [email, setEmail] = useState("");
  return (
      <div>
          
          <AuthPageLayout heading='Forgot Password?' subtext='It happens to the best of us. Enter your email and we&apos;ll send you a code to get back in ' message={
              <form>
                  <label >Email Address</label>
                    <Input
                                         
                                          placeholder="Enter email address"
                                          iconLeft={<Mail size={16} />}
                                          value={email}
                                          onChange={(e) => setEmail(e.target.value)}
                                      />
                  <Button className='w-full my-4'>Send OTP</Button>
            </form>
          } />
    </div>
  )
}

export default Page