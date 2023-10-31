import React, { useEffect, useState } from 'react'
import Hero from '../../../components/Hero/Hero'
import RowPost from '../../../components/RowPost/RowPost'
import VerifyMessage from '../../../components/CustomDialog/VerifyMessage';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Home() {
  const verified = useSelector(state => state?.user?.user?.verified);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const messageShown = sessionStorage.getItem('verifyMessageStatus');
    if(!messageShown){
      sessionStorage.setItem('verifyMessageStatus',true);
      setOpen(true);
    }
  },[]);
  const handleOpen = () => setOpen(state => !state);

  return (
    <div>
      {!verified && <VerifyMessage open={open} handleOpen={handleOpen} />}
      <Hero />
      <RowPost />
      <RowPost />
    </div>
  )
}

export default Home