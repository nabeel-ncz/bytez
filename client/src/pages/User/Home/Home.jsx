import React, { useEffect, useState } from 'react'
import Hero from '../../../components/Hero/Hero'
import RowPost from '../../../components/RowPost/RowPost'
import VerifyMessage from '../../../components/CustomDialog/VerifyMessage';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchUser } from '../../../store/actions/user/userActions';
import toast from 'react-hot-toast';
import RowBanner from '../../../components/RowPost/RowBanner';
import { getActiveBrandsApi } from '../../../services/api';
import PageLoading from '../../../components/Loading/PageLoading';

function Home() {
  const dispatch = useDispatch();
  const verified = useSelector(state => state?.user?.user?.data?.verified);
  const user = useSelector(state => state?.user?.user?.data);
  const userLoading = useSelector(state => state?.user?.user?.loading);

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useSearchParams();
  const [brands, setBrands] = useState({ first: null, second: null, third: null });
  const [brandsLoading, setBrandsLoading] = useState(false);

  useEffect(() => {
    setBrandsLoading(true);
    getActiveBrandsApi().then((response) => {
      if (response.data?.status === "ok") {
        const temp = response.data?.data?.map((item) => item.brand);
        const random = getRandomElements(temp, 3);
        setBrands(state => ({ ...state, first: random[0], second: random[1], third: random[2] }));
      }
    }).finally(() => {
      setBrandsLoading(false);
    })
  }, []);

  function getRandomElements(arr, count) {
    const shuffledArray = arr.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray.slice(0, count);
  }

  useEffect(() => {
    let showToast = searchQuery.get('email_send');
    if (showToast) {
      toast.success("A reset password email has been sent. Please check your emails.");
    }
  }, []);

  useEffect(() => {
    dispatch(fetchUser());
    const messageShown = sessionStorage.getItem('verifyMessageStatus');
    if (!messageShown) {
      sessionStorage.setItem('verifyMessageStatus', true);
      setOpen(true);
    }
  }, []);

  const handleOpen = () => setOpen(state => !state);

  return (
    <>
      {(userLoading || brandsLoading) ? <PageLoading /> : (
        <div>
          {(user && !verified) && <VerifyMessage open={open} handleOpen={handleOpen} email={user?.email} />}
          <Hero />
          <RowPost title={brands?.first} />
          <RowBanner />
          <RowPost title={brands?.second} />
          <RowPost title={brands?.third} />
        </div>
      )}
    </>
  )
}

export default Home