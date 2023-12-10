import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getAllNewsImages } from '../../store/actions/admin/adminActions';
import { BASE_URL } from '../../constants/urls';

function RowBanner({ title }) {
    const dispatch = useDispatch();
    const [posters, setPosters] = useState(null);
    useEffect(() => {
        dispatch(getAllNewsImages()).then((response) => {
            const posters = response?.payload?.data?.length > 4 ? response?.payload?.data?.splice(0, 4) : response?.payload?.data;
            setPosters(posters || null);
        });
    }, []);

    return (
        <>
            <div className='w-full pb-12 px-6 lg:px-32 flex flex-row items-center justify-between gap-2 overflow-x-auto lg:overflow-x-hidden'>
                {posters?.map((doc) => (
                    <img src={`${BASE_URL}/banners/resized/${doc.image}`} alt="" className='w-[240px] lg:w-[320px] object-cover self-start rounded-lg' />
                ))}
            </div>
        </>
    )
}

export default RowBanner