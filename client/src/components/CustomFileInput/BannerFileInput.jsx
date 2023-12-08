import React, { useState, useRef, useEffect } from "react";
import { BASE_URL } from "../../constants/urls";

const BannerFileInput = ({ onChange, onDelete, exist, file, id }) => {
    const [existingImage, setExistingImage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (exist) {
            setExistingImage(`${BASE_URL}/banners/resized/${file}`);
        }
    }, [exist]);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        setSelectedFile(file);
        onChange(file, handleClearFile);
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        onChange(file);
    };

    const handleClearFile = () => {
        setSelectedFile(null);
        onChange(null);
    };

    const handleClearExistingFile = () => {
        onDelete(id);
    }

    return (
        <>
            {
                exist ? (
                    <>
                        <div className="lg:h-80 border-dashed border-2  p-8  rounded-lg text-center bg-blue-gray-50 border-blue-gray-200">
                            <div>
                                <div className="bg-white p-2 h-52 rounded shadow-sm mb-2 flex items-center justify-center">
                                    <img
                                        src={existingImage}
                                        alt={"Loading..."}
                                        className="object-contain w-full h-full rounded"
                                    />
                                </div>
                                <button
                                    type='button'
                                    className="mt-2 bg-blue-gray-800 text-white text-xs font-medium py-1 px-3 rounded"
                                    onClick={handleClearExistingFile}
                                >
                                    Remove Image
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            className={` lg:h-80 border-dashed border-2  p-8 rounded-lg text-center ${isDragging
                                ? "bg-blue-gray-200 border-blue-gray-800"
                                : "bg-blue-gray-50 border-blue-gray-200"
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {selectedFile ? (
                                <div className="mt-4 lg:mt-0">
                                    <div className="bg-white p-2 h-52 rounded shadow-sm mb-2 ">
                                        {selectedFile.type.startsWith("image/") ? (
                                            <img
                                                src={URL.createObjectURL(selectedFile)}
                                                alt={selectedFile.name}
                                                className="object-contain w-full h-full rounded"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 bg-gray-100"></div>
                                        )}
                                        <p className="truncate text-xs mt-3">{selectedFile.name}</p>
                                    </div>
                                    <button
                                        className="mt-4 bg-blue-gray-800 text-white text-base font-medium py-1 px-3 rounded"
                                        onClick={handleClearFile}
                                    >
                                        Clear File
                                    </button>
                                </div>
                            ) : (
                                <div className="lg:mt-16">
                                    <div className="flex justify-center">
                                        <img src="/images/image-broken.png" alt="" className="w-6" />
                                    </div>
                                    <p className="text-sm text-gray-400 my-2">
                                        Drag and drop an image here, or click to upload
                                    </p>
                                    <button
                                        type="button"
                                        className="bg-zinc-200 text-sm font-semibold py-2 px-4 rounded"
                                        onClick={handleButtonClick}
                                    >
                                        Upload Image
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                            )}
                        </div>
                    </>
                )}
        </>
    );
};
export default BannerFileInput;