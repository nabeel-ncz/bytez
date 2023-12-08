import React from 'react'
import { BASE_URL } from '../../constants/urls'

function ExistingFileInput({ clearExistingFile, imageUrl }) {
    return (
        <div className="lg:h-40 h-40 w-50 border-dashed border-2 p-4 rounded-lg text-center bg-blue-gray-50 border-blue-gray-200">
            <div>
                <div className="rounded flex flex-col items-center justify-center">
                    <img
                        src={`${BASE_URL}/products/resized/${imageUrl}`}
                        alt={"Loading..."}
                        className="rounded h-20"
                    />
                </div>
                <button
                    type='button'
                    className="mt-2 bg-blue-gray-800 text-white text-xs font-medium py-1 px-3 rounded"
                    onClick={() => clearExistingFile(imageUrl)}
                >
                    Clear File
                </button>
            </div>
        </div>
    )
}

export default ExistingFileInput