import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getAllNewsImages } from '../../store/actions/admin/adminActions';

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
            <div className='w-full pb-12 px-6 lg:px-32 flex flex-row items-center justify-between gap-2'>
                {posters?.map((doc) => (
                    <img src={`http://localhost:3000/banners/resized/${doc.image}`} alt="" className='w-[320px] object-cover self-start rounded-lg' />
                ))}
            </div>
        </>
    )
}

export default RowBanner