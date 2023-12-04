import React, { useEffect } from 'react';
import { Breadcrumbs, Button, Chip } from '@material-tailwind/react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCoupons } from '../../../store/actions/admin/adminActions';
import { Link, useNavigate } from 'react-router-dom';

function Coupons() {
  const coupons = useSelector(state => state.admin.coupons?.data);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllCoupons());
  }, []);

  return (
    <div className="p-5 w-full overflow-y-auto">
      <div className="flex justify-between items-center text-xs font-semibold">
        <div>
          <h1 className="font-bold text-2xl">Coupons</h1>
          <Breadcrumbs>
            <Link to={"/admin"} className="opacity-60">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </Link>
            <Link to={"/admin/coupons"}>
              coupons
            </Link>
          </Breadcrumbs>
        </div>
        <div className="flex gap-3">
          <Button variant='gradient' onClick={() => navigate('/admin/coupons/create')}>
            Add Coupon
          </Button>
        </div>
      </div>
      <div className="overflow-x-scroll lg:overflow-hidden bg-white rounded-lg">
        <table className="w-full min-w-max table-auto">
          <thead className="font-normal">
            <tr className="border-b border-gray-200">
              <th className="font-semibold p-4 text-left border-r">Coupon</th>
              <th className="font-semibold p-4 text-left border-r">Expire From</th>
              <th className="font-semibold p-4 text-left border-r">Expire To</th>
              <th className="font-semibold p-4 text-left border-r">Discount</th>
              <th className="font-semibold p-4 text-left border-r">Coupon Type</th>
              <th className="font-semibold p-4 text-left border-r">Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons?.map((doc) => (
              <tr className={`hover:bg-blue-gray-50 active:bg-blue-gray-50 cursor-pointer`}>
                <td className="text-sm p-4 text-start border-r">{doc.code}</td>
                <td className="text-sm p-4 text-start border-r">{new Date(doc.validFrom).toLocaleString()}</td>
                <td className="text-sm p-4 text-start border-r">{new Date(doc.validTo).toLocaleString()}</td>
                <td className="text-sm p-4 text-start border-r">{doc.discountPercentage}%</td>
                <td className="text-sm p-4 text-start border-r">{doc.couponType.split('_').join(' ').toUpperCase()}</td>
                <td className="text-sm p-4 text-start border-r">
                  {new Date(doc.validTo) > new Date(Date.now()) ?
                    (
                      <Chip variant="ghost" color={"blue"} size="sm" value={"Active"} className='text-center' />
                    ) : (
                      <Chip variant="ghost" color={"brown"} size="sm" value={"InActive"} className='text-center' />
                    )
                  }
                </td>
                <td className="text-sm p-4 text-start border-r">
                  <Button size='sm' onClick={() => { navigate(`/admin/coupons/update/${doc._id}`) }}>Update</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Coupons