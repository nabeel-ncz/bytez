import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getStoreProducts } from '../../store/actions/products/productsAction';

function SearchDialog({ handleOpen, open }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useSearchParams();

    const [searchValue, setSearchValue] = useState("");
    const handleSearch = () => {
        navigate(`/store?search=${searchValue}`);
        handleOpen();
        setSearchValue("");
    }

    useEffect(() => {
        const value = searchQuery.get('search');
        if(value){
            setSearchValue(value);
        };
    },[searchQuery]);

    return (
        <Dialog
            open={open}
            handler={handleOpen}
            animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.9, y: -100 },
            }}
        >
            <DialogBody className='w-full px-8 pt-12 pb-4'>
                <div className='w-full h-14 flex items-center justify-between gap-4 px-4 border border-gray-600 rounded'>
                    <img src="/icons/search-icon.png" alt="" className='w-8 opacity-80' />
                    <input value={searchValue} onChange={(event) => { setSearchValue(event.target.value) }} type="text" placeholder='Search here...' className='outline-none w-full text-blue-gray-900' />
                </div>
            </DialogBody>
            <DialogFooter className='w-full px-8'>
                <Button
                    variant="outlined"
                    onClick={handleOpen}
                    className="mr-1"
                >
                    <span>Cancel</span>
                </Button>
                <Button variant="gradient" onClick={handleSearch}>
                    <span>Search</span>
                </Button>
            </DialogFooter>
        </Dialog>

    )
}

export default SearchDialog