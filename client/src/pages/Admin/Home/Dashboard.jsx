import React, { useEffect, useState } from 'react'
import SalesByDate from '../../../components/CustomCharts/SalesByDate'
import { useDispatch, useSelector } from 'react-redux';
import { getAllBrands } from '../../../store/actions/admin/adminActions';
import SalesByBrand from '../../../components/CustomCharts/SalesByBrand';
import PageLoading from '../../../components/Loading/PageLoading';
// import SideNavbar from '../../../components/Navbar/SideNavbar'

function Dashboard() {
    const dispatch = useDispatch();
    const brands = useSelector(state => state.admin?.brands?.data);
    const [brandsLoading, setBrandsLoading] = useState(false);

    useEffect(() => {
        setBrandsLoading(true);
        dispatch(getAllBrands()).finally(() => {
            setBrandsLoading(false);
        });
    }, []);

    return (
        <>
            {brandsLoading ? <PageLoading /> : (
                <>
                    <div className='w-full flex items-start justify-start flex-wrap gap-2 lg:gap-10 py-4'>
                        {brands?.filter((doc) => doc.status === "active")
                            .map((doc) => (
                                <>
                                    <SalesByBrand key={doc._id} id={doc._id} brand={doc.brand} />
                                </>
                            ))
                        }
                    </div>
                    <SalesByDate />
                </>

            )}
        </>
    )
}

export default Dashboard