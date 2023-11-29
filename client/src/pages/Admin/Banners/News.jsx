import React, { useEffect } from 'react'
import BannerFileInput from '../../../components/CustomFileInput/BannerFileInput'
import { useDispatch, useSelector } from 'react-redux'
import { createBanner, deleteBanner, getAllNewsImages } from '../../../store/actions/admin/adminActions';

function News() {
    const dispatch = useDispatch();
    const newsImages = useSelector(state => state?.admin?.news?.data);

    useEffect(() => {
        dispatch(getAllNewsImages());
    }, []);

    const handleUploadFile = (file, clear) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'news');
        dispatch(createBanner(formData)).then(() => {
            dispatch(getAllNewsImages()).then(() => {
                clear();
            })
        });
    }

    const handleDeleteFile = (id) => {
        dispatch(deleteBanner(id)).then(() => {
            dispatch(getAllNewsImages());
        })
    }


    return (
        <>
            <div className='w-full h-full flex flex-wrap items-center justify-start px- py-4 gap-4'>
                {newsImages?.map((doc) => (
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

export default News;