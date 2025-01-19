import React from 'react'
import BudgetList from './_components/BudgetList'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowBigRight } from 'lucide-react'

function Budget() {
  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl'>My Budgets</h2>
      <BudgetList/>
      <div className='mt-5 p-5 flex justify-center'>
      <Link href="/dashboard/krishiniyojak">
        <Button className='bg-primary'>Go To KrishiNiyojak <ArrowBigRight/></Button>
        </Link>
      </div>
      
    </div>
  )
}

export default Budget