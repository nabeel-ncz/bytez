import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Breadcrumbs, Button } from '@material-tailwind/react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCarouselImages, getAllPosterImages, getAllNewsImages } from '../../../store/actions/admin/adminActions';
import { BASE_URL } from '../../../constants/urls';

function Banners() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const carouselImages = useSelector(state => state?.admin?.carousel?.data);
  const posterImages = useSelector(state => state?.admin?.poster?.data);
  const newsImages = useSelector(state => state?.admin?.news?.data);

  useEffect(() => {
    dispatch(getAllCarouselImages());
    dispatch(getAllPosterImages());
    dispatch(getAllNewsImages());
  }, []);

  return (
    <div className="p-5 w-full overflow-y-auto">
      <div className="flex justify-between items-center text-xs font-semibold">
        <div>
          <h1 className="font-bold text-2xl">Banners</h1>
          <Breadcrumbs>
            <Link to={"/admin"} className="opacity-60">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </Link>
            <Link to={"/admin/banners"}>
              Banners
            </Link>
          </Breadcrumbs>
        </div>
      </div>
      <div className="overflow-x-scroll lg:overflow-hidden bg-white rounded-lg">
        <table className="w-full min-w-max table-auto">
          <thead className="font-normal">
            <tr className="border-b border-gray-200">
              <th className="font-semibold p-4 text-left border-r">Type</th>
              <th className="font-semibold p-4 text-left border-r">No Of Images</th>
              <th className="font-semibold p-4 text-left border-r"></th>
            </tr>
          </thead>
          <tbody>
            <tr onClick={() => navigate('carousel')} className={`hover:bg-blue-gray-50 active:bg-blue-gray-50 cursor-pointer`}>
              <td className="text-sm p-4 text-start border-r">Carousel</td>
              <td className="text-sm p-4 text-start border-r">{carouselImages?.length || 0}</td>
              <td className="text-sm p-4 text-start border-r flex items-center justify-start gap-2">
                {carouselImages?.map((item) => (
                  <img src={`${BASE_URL}/banners/resized/${item.image}`} alt="" className='h-14' />
                ))}
              </td>
            </tr>
            <tr onClick={() => navigate('poster')} className={`hover:bg-blue-gray-50 active:bg-blue-gray-50 cursor-pointer`}>
              <td className="text-sm p-4 text-start border-r">Poster</td>
              <td className="text-sm p-4 text-start border-r">{posterImages?.length || 0}</td>
              <td className="text-sm p-4 text-start border-r flex items-center justify-start gap-2">
                {posterImages?.map((item) => (
                  <img src={`${BASE_URL}/banners/resized/${item.image}`} alt="" className='h-14' />
                ))}
              </td>
            </tr>
            <tr onClick={() => navigate('news')} className={`hover:bg-blue-gray-50 active:bg-blue-gray-50 cursor-pointer`}>
              <td className="text-sm p-4 text-start border-r">News</td>
              <td className="text-sm p-4 text-start border-r">{newsImages?.length || 0}</td>
              <td className="text-sm p-4 text-start border-r flex items-center justify-start gap-2">
                {newsImages?.map((item) => (
                  <img src={`${BASE_URL}/banners/resized/${item.image}`} alt="" className='h-14' />
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div >
  )
}

export default Banners