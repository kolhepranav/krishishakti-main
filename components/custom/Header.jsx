import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { useUser } from '@clerk/nextjs';

function Header() {
  const { user } = useUser();

  const userFullName = user?.fullName;

  return (
    <div className='p-5 shadow-sm border-b flex justify-between'>
        <div>
        <h2 className="font-bold text-3xl text-gray-500">Hi, {userFullName} 👋</h2>
        </div>
        <div>
            <UserButton />
        </div>
       
    </div>
  )
}

export default Header;