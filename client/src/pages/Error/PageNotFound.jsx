import React from 'react'

function PageNotFound() {
  return (
    <>
      <div className='w-screen h-screen bg-red-100 flex flex-col items-center justify-center'>
            <h2 className='font-medium text-5xl'>404</h2>
            <h1 className='font-medium text-xl'>Page Not Found!</h1>
        </div>
    </>
  )
}

export default PageNotFound