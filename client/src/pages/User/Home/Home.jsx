import React, { useEffect, useState } from 'react'
import Hero from '../../../components/Hero/Hero'
import RowPost from '../../../components/RowPost/RowPost'
import VerifyMessage from '../../../components/CustomDialog/VerifyMessage';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../../../store/actions/user/userActions';

function Home() {
  const verified = useSelector(state => state?.user?.user?.data?.verified);
  const user = useSelector(state => state?.user?.user?.data);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUser());
    const messageShown = sessionStorage.getItem('verifyMessageStatus');
    if(!messageShown){
      sessionStorage.setItem('verifyMessageStatus',true);
      setOpen(true);
    }
  },[]);
  const handleOpen = () => setOpen(state => !state);

  return (
    <div>
      {(user && !verified) && <VerifyMessage open={open} handleOpen={handleOpen} email={user?.email} />}
      <Hero />
      <RowPost />
      <RowPost />
    </div>
  )
}

export default Home