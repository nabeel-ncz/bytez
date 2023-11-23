import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllTransactions } from '../../../store/actions/admin/adminActions';
import { Breadcrumbs, Link, Chip } from '@material-tailwind/react';
import Pagination from '../../../components/Pagination/Pagination';

function Payments() {
  const transactions = useSelector(state => state.admin.transactions?.data);
  const [totalPage, setTotalPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllTransactions({
      page: activePage,
      limit: 5,
    })).then((response) => {
      if (response.payload?.totalPages) {
        setTotalPage(response.payload?.totalPages)
      }
    })
  }, [activePage]);

  const next = () => {
    if (activePage === totalPage) return;
    setActivePage(state => state + 1);
  };
  const prev = () => {
    if (activePage === 1) return;
    setActivePage(state => state - 1);
  };

  return (
    <div className="p-5 w-full overflow-y-auto">
      <div className="flex justify-between items-center text-xs font-semibold">
        <div>
          <h1 className="font-bold text-2xl">Transactions</h1>
        </div>
        <div className="flex gap-3"></div>
      </div>
      <div className="lg:flex justify-between items-center text-xs font-semibold"></div>
      <div className="overflow-x-scroll bg-white rounded-lg">
        <table className="w-full table-auto">
          <thead className="font-normal">
            <tr className="border-b border-gray-200">
              <th className="font-semibold p-4 text-left border-r">Transaction Id</th>
              <th className="font-semibold p-4 text-left border-r">User Id</th>
              <th className="font-semibold p-4 text-left border-r">Pending Amount</th>
              <th className="font-semibold p-4 text-left border-r">Amount Paid</th>
              <th className="font-semibold p-4 text-left border-r">Amount Refunded</th>
              <th className="font-semibold p-4 text-left border-r">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.map((doc) => (
              <tr className={`hover:bg-blue-gray-50 active:bg-blue-gray-50 cursor-pointer`}>
                <td className="text-sm p-4 text-start border-r">
                  {doc._id}
                </td>
                <td className="text-sm p-4 text-start border-r">{doc.userId}</td>
                <td className="text-sm p-4 text-start border-r">{doc.pendingAmount}</td>
                <td className="text-sm p-4 text-start border-r">{doc.amountPaid}</td>
                <td className="text-sm p-4 text-start border-r">{doc.refundAmount}</td>
                <td className="text-sm p-4 text-start border-r">
                  <Chip
                    variant="ghost"
                    color={'blue'}
                    size="sm"
                    value={doc.paymentMethod}
                    className='text-center'
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex items-center justify-end p-4'>
        <Pagination next={next} prev={prev} total={totalPage} active={activePage} />
      </div>
    </div>
  )
}

export default Payments