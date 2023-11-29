import React, { useEffect } from 'react'
import BannerFileInput from '../../../components/CustomFileInput/BannerFileInput'
import { useDispatch, useSelector } from 'react-redux'
import { createBanner, deleteBanner, getAllPosterImages } from '../../../store/actions/admin/adminActions';

function Posters() {
    const dispatch = useDispatch();
    const posterImages = useSelector(state => state?.admin?.poster?.data);

    useEffect(() => {
        dispatch(getAllPosterImages());
    }, []);

    const handleUploadFile = (file, clear) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'poster');
        dispatch(createBanner(formData)).then(() => {
            dispatch(getAllPosterImages()).then(() => {
                clear();
            })
        });
    }

    const handleDeleteFile = (id) => {
        dispatch(deleteBanner(id)).then(() => {
            dispatch(getAllPosterImages());
        })
    }


    return (
        <>
            <div className='w-full h-full flex flex-wrap items-center justify-start px- py-4 gap-4'>
                {posterImages?.map((doc) => (
                    <div className='w-1/4'>
                        <BannerFileInput id={doc._id} file={doc.image} exist={true} onChange={handleUploadFile} onDelete={handleDeleteFile} />
                    </div>
                ))}
                <div className='w-1/4'>
                    <BannerFileInput id={null} file={null} exist={false} onChange={handleUploadFile} onDelete={handleDeleteFile} />
                </div>
            </div>
        </>
    )
}

export default Posters;