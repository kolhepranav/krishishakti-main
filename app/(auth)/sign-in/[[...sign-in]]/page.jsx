import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    // <div className=' w-full h-full flex justify-center items-center'> 
    //   <SignIn />
    // </div>

    <SignIn
  fallbackRedirectUrl="/dashboard" // Redirects if the user doesn’t have specific access
  forceRedirectUrl="/dashboard"   // Always redirects to the specified URL
/>

  )
}