import { Button } from '@material-tailwind/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function NoAccount() {
    const navigate = useNavigate();
  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center'>
        <h2>Please create an Account first!</h2>
        <Button variant='gradient' size='md' onClick={() => {
            navigate('/signup');
        }}>Signup</Button>
    </div>
  )
}

export default NoAccount