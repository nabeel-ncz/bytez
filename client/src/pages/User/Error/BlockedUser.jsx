import React from 'react'

function BlockedUser() {
  return (
    <>
        <div className='w-screen h-screen bg-red-100 flex items-center justify-center'>
            <h2 className='font-medium text-xl'>You are blocked from the site</h2>
        </div>
    </>
  )
}

export default BlockedUser