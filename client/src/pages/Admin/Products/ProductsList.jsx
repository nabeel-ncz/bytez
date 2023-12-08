import React, { useEffect, useState } from 'react';
import { Breadcrumbs, Chip, Button } from "@material-tailwind/react";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import CustomTabs from '../../../components/Tabs/CustomTabs';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../../../store/actions/admin/adminActions';
import Pagination from "../../../components/Pagination/Pagination";
import { BASE_URL } from '../../../constants/urls';

function ViewProducts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector(state => state.admin?.products?.data);
  const [activePage, setActivePage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useSearchParams();

  useEffect(() => {
    const search = searchQuery.get('search');
    console.log(search)
    dispatch(getAllProducts({ page: activePage, limit: 5, search })).then((response) => {
      if (response.payload?.totalPage) {
        setTotalPage(response.payload?.totalPage)
      }
    })
  }, [activePage]);

  const next = () => {
    if (activePage === totalPage) return;
    setActivePage(state => state + 1);
  };
  const prev = () => {
    if (activePage === 1) return;
    setActivePage(state => state - 1);
  };

  const handleSearch = () => {
    setSearchQuery({ search: searchValue });
    dispatch(getAllProducts({ page: activePage, limit: 5, search: searchValue })).then((response) => {
      if (response.payload?.totalPage) {
        setTotalPage(response.payload?.totalPage)
      }
    })
  }

  return (
    <>
      <div className="p-5 w-full overflow-y-auto">
        <div className="flex justify-between items-center text-xs font-semibold">
          <div>
            <h1 className="font-bold text-2xl">Products</h1>
            <Breadcrumbs>
              <Link to={"/admin"} className="opacity-60">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </Link>
              <Link to={"/admin/products"}>
                Products
              </Link>
            </Breadcrumbs>
          </div>
          <div className="flex gap-3">
            <div className='flex items-center justify-center gap-2 py-2 px-4 bg-white'>
              <input type="text" onBlur={handleSearch} value={searchValue} onChange={(evt) => { setSearchValue(evt.target.value) }} className='h-8 p-2 bg-transparent outline-none focus:border-gray-400 text-base' />
              <img src="/icons/search-icon.png" alt="" className='w-5 opacity-50' />
            </div>
            <Button variant='gradient' onClick={() => navigate("create")}>
              Add Product
            </Button>
          </div>
        </div>
        <div className="lg:flex justify-between items-center text-xs font-semibold">
          <div className="flex my-2 gap-3">
          </div>
        </div>
        <div className="bg-white p-8 overflow-x-scroll">
          <table className="w-full table-auto">
            <thead className="font-normal">
              <tr className="border-b border-gray-200">
                <th className="font-semibold p-4 text-left border-r">Name</th>
                <th className="font-semibold p-4 text-left border-r">Varients</th>
                <th className="font-semibold p-4 text-left border-r">Category Id</th>
                <th className="font-semibold p-4 text-left border-r">Brand Id</th>
                <th className="font-semibold p-4 text-left border-r">Quantity</th>
                <th className="font-semibold p-4 text-left border-r">Added</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((doc) => (
                <tr key={doc?._id}
                  onClick={() => { navigate(`/admin/products/view/${doc._id}`) }} className={`hover:bg-blue-gray-50 active:bg-blue-gray-50 cursor-pointer`}
                >
                  <td className="text-sm p-4 flex items-center gap-2 text-start border-r">
                    <div className="w-10 h-10 overflow-clip flex justify-center items-center">
                      {doc.varients[0]?.images?.mainImage ? (
                        <img
                          src={`${BASE_URL}/products/resized/${doc.varients[0]?.images?.mainImage}`}
                          alt="img"
                          className="object-contain w-full h-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-slate-300 rounded-md"></div>
                      )}
                    </div>
                    <span>{doc.title}</span>
                  </td>
                  <td className="text-sm p-4 text-start border-r">{doc.varients?.length}</td>
                  <td className="text-sm p-4 text-start border-r">{doc.category}</td>
                  <td className="text-sm p-4 text-start border-r">{doc.brand}</td>
                  <td className="text-sm p-4 text-start border-r">{doc.varients?.reduce((sum, item) => sum + item.stockQuantity, 0)}</td>
                  <td className="text-sm p-4 text-start border-r">{new Date(doc.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='flex items-center justify-end p-4'>
          <Pagination next={next} prev={prev} total={totalPage} active={activePage} />
        </div>
      </div>
    </>
  )
}

export default ViewProducts