import React, { useEffect } from 'react';
import { Breadcrumbs, Button, Chip } from '@material-tailwind/react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories } from '../../../store/actions/admin/adminActions';

function Categories() {
    const categories = useSelector(state => state?.admin?.categories.data);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllCategories());
    }, []);

    return (
        <div className="p-5 w-full overflow-y-auto">
            <div className="flex justify-between items-center text-xs font-semibold">
                <div>
                    <h1 className="font-bold text-2xl">Categories</h1>
                    <Breadcrumbs>
                        <Link to={"/admin"} className="opacity-60">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" >
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                        </Link>
                        <Link to={"/admin/categories"}>
                            Categories
                        </Link>
                    </Breadcrumbs>
                </div>
                <div className="flex gap-3">
                    <Button variant='gradient' onClick={() => navigate('/admin/categories/create')}>
                        Add Category
                    </Button>
                </div>
            </div>
            <div className="overflow-x-scroll lg:overflow-hidden bg-white rounded-lg">
                <table className="w-full min-w-max table-auto">
                    <thead className="font-normal">
                        <tr className="border-b border-gray-200">
                            <th className="font-semibold p-4 text-left border-r">Category</th>
                            <th className="font-semibold p-4 text-left border-r">Category Id</th>
                            <th className="font-semibold p-4 text-left border-r">Status</th>
                            <th className="font-semibold p-4 text-left border-r">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories?.map((doc) => (
                            <tr className={`hover:bg-blue-gray-50 active:bg-blue-gray-50 cursor-pointer`}>
                                <td className="text-sm p-4 text-start border-r">{doc.category}</td>
                                <td className="text-sm p-4 text-start border-r">{doc._id}</td>
                                <td className="text-sm p-4 text-start border-r">
                                    {doc.status === 'active' ?
                                        (
                                            <Chip variant="ghost" color={"blue"} size="sm" value={"Active"} className='text-center' />
                                        ) : (
                                            <Chip variant="ghost" color={"red"} size="sm" value={"Block"} className='text-center' />
                                        )}
                                </td>
                                <td className="text-sm p-4 text-start border-r">
                                    <Button size='sm' onClick={() => { navigate(`/admin/categories/update/${doc._id}`) }}>Update</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Categories