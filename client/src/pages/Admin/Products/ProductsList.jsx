import React, { useEffect } from 'react';
import { Breadcrumbs, Chip, Button } from "@material-tailwind/react";
import { Link, useNavigate } from 'react-router-dom';
import CustomTabs from '../../../components/Tabs/CustomTabs';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../../../store/actions/admin/adminActions';


function ViewProducts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector(state => state.admin?.products?.data);
  useEffect(() => {
    dispatch(getAllProducts());
  }, []);
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
            <button className="flex items-center gap-2 p-2 rounded-lg bg-gray-200 text-blue-700">
              Export
            </button>
            <button onClick={() => navigate("create")}
              className="flex items-center gap-2 p-2 rounded-lg bg-blue-700 text-white"
            >
              Add Product
            </button>
          </div>
        </div>
        <div className="lg:flex justify-between items-center text-xs font-semibold">
          {/* <CustomTabs /> */}
          <div className="flex my-2 gap-3">
            <button className="flex items-center gap-2 p-2 rounded-lg bg-white">
              Select Date
            </button>
            <button className="flex items-center gap-2 p-2 rounded-lg bg-white">
              Filters
            </button>
          </div>
        </div>
        <div className="overflow-x-scroll lg:overflow-hidden bg-white rounded-lg">
          <table className="w-full min-w-max table-auto ">
            <thead className="font-normal">
              <tr className="border-b border-gray-200">
                <th className="font-semibold p-4 text-left border-r">Name</th>
                <th className="font-semibold p-4 text-left border-r">Varients</th>
                <th className="font-semibold p-4 text-left border-r w-60">Description</th>
                <th className="font-semibold p-4 text-left border-r">Category</th>
                <th className="font-semibold p-4 text-left border-r">Quantity</th>
                <th className="font-semibold p-4 text-left border-r">Price</th>
                <th className="font-semibold p-4 text-left border-r">Status</th>
                <th className="font-semibold p-4 text-left border-r">Added</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((doc) => (
                <tr
                  onClick={() => { }} className={`hover:bg-blue-gray-50 active:bg-blue-gray-50 cursor-pointer`}
                >
                  <td className="text-sm p-4 flex items-center gap-2 text-start border-r">
                    <div className="w-10 h-10 overflow-clip flex justify-center items-center">
                      {doc.varients[0]?.images?.mainImage ? (
                        <img
                          src={`http://localhost:3000/products/resized/${doc.varients[0]?.images?.mainImage}`}
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
                  <td className="text-sm p-4 text-start border-r">
                    {doc.varients[0]?.description}
                  </td>
                  <td className="text-sm p-4 text-start border-r">{doc.category}</td>
                  <td className="text-sm p-4 text-start border-r">{doc.varients[0]?.stockQuantity}</td>
                  <td className="text-sm p-4 text-start border-r">{doc.varients[0]?.price}</td>
                  <td className="text-sm p-4 text-start border-r">
                    {doc.varients[0]?.status === "instock" && 
                    (<Chip variant="ghost" color={"green"} size="sm" value={"In Stock"} className='text-center' />)
                    }
                    {doc.varients[0]?.status === "outofstock" && 
                    (<Chip variant="ghost" color={"red"} size="sm" value={"Out Of Stock"} className='text-center' />)
                    }
                    {doc.varients[0]?.status === "draft" && 
                    (<Chip variant="ghost" color={"blue"} size="sm" value={"Draft"} className='text-center' />)
                    }
                  </td>
                  <td className="text-sm p-4 text-start border-r">{new Date(doc.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default ViewProducts