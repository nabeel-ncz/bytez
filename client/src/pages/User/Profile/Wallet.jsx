import { Button, Chip } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUserTransactions } from '../../../store/actions/user/userActions';
import Pagination from '../../../components/Pagination/Pagination';
import { useNavigate } from 'react-router-dom';


function Wallet() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const transactions = useSelector(state => state?.user?.transactions?.data);
  const user = useSelector(state => state.user?.user?.data);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    dispatch(getAllUserTransactions({
      id: user?._id,
      page: activePage,
      limit: 5,
    })).then((response) => {
      setTotalPages(response?.payload?.data?.totalPages || 1);
    })
  }, [activePage]);

  const next = () => {
    if (activePage === totalPages) return;
    setActivePage(state => state + 1);
  };
  const prev = () => {
    if (activePage === 1) return;
    setActivePage(state => state - 1);
  };



  return (
    <div className='w-full lg:w-9/12 shadow-sm'>
      <div className='w-full bg-white rounded shadow-sm flex items-center justify-between px-8 py-4'>
        <div className='flex items-center justify-start gap-4'>
          <img src="/icons/wallet_black.png" alt="" className='w-14 opacity-60' />
          <div className='flex flex-col items-start justify-center'>
            <h2 className='text-2xl font-semibold'>₹.{user?.wallet || 0}</h2>
            <h2 className='text-xs font-base'>My Wallet Balance</h2>
          </div>
        </div>
        <Button onClick={() => { navigate(`/store`) }} size='sm'>Purchase</Button>
      </div>
      <div className='bg-white w-full flex items-center justify-start ps-8'>
        {user?.referral && (
          <h6>Referral : <span className='text-base font-medium'>{user?.referral || 0}</span>
            <span className="text-xs font-medium"> x {user?.referral / 100}</span>
          </h6>
        )}
      </div>
      <div className='w-full bg-white rounded shadow-sm px-8 py-4 overflow-x-scroll'>
        <table className="w-full min-w-max table-auto">
          <thead className="font-normal">
            <tr className="border-b border-gray-200">
              <th className="font-semibold text-sm p-4 text-left border-r">Transaction Id</th>
              <th className="font-semibold text-sm p-4 text-left border-r">Method</th>
              <th className="font-semibold text-sm p-4 text-left border-r">Amount Pending</th>
              <th className="font-semibold text-sm p-4 text-left border-r">Amount Paid</th>
              <th className="font-semibold text-sm p-4 text-left border-r">Amount Refunded</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.map((doc) => (
              <tr className={`hover:bg-blue-gray-50 active:bg-blue-gray-50 cursor-pointer`}>
                <td className="text-sm p-4 text-start border-r">{doc._id}</td>
                <td className="text-sm p-4 text-start border-r">
                  {doc.paymentMethod === "COD" ? (
                    <Chip variant="ghost" color={"blue"} size="sm" value={"COD"} className='text-center' />
                  ) : doc.paymentMethod === "RazorPay" ? (
                    <Chip variant="ghost" color={"blue"} size="sm" value={"RazorPay"} className='text-center' />
                  ) : doc.paymentMethod === "Wallet" ? (
                    <Chip variant="ghost" color={"blue"} size="sm" value={"Wallet"} className='text-center' />
                  ) : (
                    <Chip variant="ghost" color={"blue"} size="sm" value={"nil"} className='text-center' />
                  )}
                </td>
                <td className="text-sm p-4 text-start border-r">₹.{doc.pendingAmount}</td>
                <td className="text-sm p-4 text-start border-r">₹.{doc.amountPaid}</td>
                <td className="text-sm p-4 text-start border-r">₹.{doc.refundAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='w-full flex items-center justify-end px-4 py-4'>
        <Pagination next={next} prev={prev} total={totalPages} active={activePage} />
      </div>
    </div>
  )
}

export default Wallet