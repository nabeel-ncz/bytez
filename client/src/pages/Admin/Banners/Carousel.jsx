import React, { useEffect } from 'react'
import BannerFileInput from '../../../components/CustomFileInput/BannerFileInput'
import { useDispatch, useSelector } from 'react-redux'
import { createBanner, deleteBanner, getAllCarouselImages } from '../../../store/actions/admin/adminActions';

function Carousel() {
    const dispatch = useDispatch();
    const carouselImages = useSelector(state => state?.admin?.carousel?.data);

    useEffect(() => {
        dispatch(getAllCarouselImages());
    }, []);

    const handleUploadFile = (file, clear) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'carousel');
        dispatch(createBanner(formData)).then(() => {
            dispatch(getAllCarouselImages()).then(() => {
                clear();
            })
        });
    }

    const handleDeleteFile = (id) => {
        dispatch(deleteBanner(id)).then(() => {
            dispatch(getAllCarouselImages());
        })
    }


    return (
        <>
            <div className='w-full h-full flex flex-wrap items-center justify-start px- py-4 gap-4'>
                {carouselImages?.map((doc) => (
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

export default Carousel