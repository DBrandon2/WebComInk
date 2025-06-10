import React from 'react'

export default function ComicsFilter() {
  return (
    <div className='flex w-full h-[50px]'>
      <button className='bg-accent flex-1'>En cours</button>
      <button className='bg-accent-hover flex-1'>Terminé</button>
    </div>
  )
}
