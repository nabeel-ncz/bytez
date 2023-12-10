import React, { useEffect, useState } from 'react';
import { Button } from "@material-tailwind/react"
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changeDefaultAddress, deleteAddress, getAllAddresses } from '../../../store/actions/user/userActions';
import DeleteAddress from '../../../components/CustomDialog/DeleteAddress';

function ShippingAddress() {
    const [error, setError] = useState(null);
    const address = useSelector(state => state?.user?.addresses?.data);
    const user = useSelector(state => state.user?.user?.data);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currDeleteId, setCurrDeleteId] = useState(null);
 

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllAddresses(user?._id)).then((response) => {
            if (response?.error) {
                setError(response?.error?.message);
            }
        })
    }, [])

    const handleDefaultAddress = (addressId) => {
        dispatch(changeDefaultAddress({
            userId: user?._id,
            addressId: addressId,
        })).then(() => {
            dispatch(getAllAddresses(user?._id)).then((response) => {
                if (response?.error) {
                    setError(response?.error?.message);
                }
            })
        })
    }
    const handleDeleteAddress = (addressId) => {
        setCurrDeleteId(addressId);
        setDialogOpen(true);
    }
    const handleDialogOpen = () => {
        setDialogOpen(state => !state);
    }

    return (
        <>
            <div className='w-full lg:w-9/12 shadow-sm'>
                <div className='w-full flex items-center justify-end mb-4'>
                    <Button onClick={() => { navigate('create') }}>Add Address</Button>
                </div>
                <div className='flex flex-col w-full items-start justify-start gap-4'>
                    {(!address && error) && <h2>{error}</h2>}
                    {address?.addresses?.length === 0 && <h2>No addresses exist!, please create an address</h2>}
                    {address?.addresses?.map((doc) => (
                        <div key={doc._id} className='w-full bg-white rounded shadow-sm'>
                            <div className='w-full flex items-center justify-between border-b border-gray-400 px-6 py-1'>
                                <input type="radio" name='defaultAddress' className='' checked={address?.defaultAddress === doc._id} onChange={() => handleDefaultAddress(doc._id)} />
                                <div className='flex items-center gap-2'>
                                    {(address?.defaultAddress === doc._id) && (
                                        <span className='px-4 py-2 bg-blue-400 text-white text-xs'>Default</span>
                                    )}

                                    <img src="/icons/bin.png" alt="" className='w-9 border border-gray-400 p-2' onClick={() => handleDeleteAddress(doc._id)} />
                                    <img src="/icons/edit-icon.png" alt="" className='w-9 border border-gray-400 p-2' onClick={() => { navigate(`update?uId=${user?._id}&aId=${doc._id}`)}} />
                                </div>
                            </div>
                            <div className='w-full flex flex-col items-start px-6 py-3 font-medium text-sm text-start'>
                                <h2>{doc.firstName} {doc.lastName}</h2>
                                <p className='opacity-70 text-start'>{doc.houseAddress}, {doc.city}, {doc.state}, {doc.zipcode}, {doc.country}</p>
                                <h2 className='opacity-70'>Phone : {doc.phone}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <DeleteAddress open={dialogOpen} handleOpen={handleDialogOpen} addressId={currDeleteId} userId={user?._id} />
        </>
    )
}

export default ShippingAddress