'use client'
import React from 'react'
import { useRouter } from "next/navigation";
type Props = {}

const Gobackbutton = (props: Props) => {
    const router = useRouter();

  
  return (
     
  
        <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-md border text-sm"
        >
            ← Go back
        </button>
  )
}

export default Gobackbutton