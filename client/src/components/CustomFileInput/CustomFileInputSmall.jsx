import React, { useState, useRef } from "react";

const CustomFileInputSmall = ({ handleChange, imageName }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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
    handleChange(file,imageName);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; 
    setSelectedFile(file);
    handleChange(file, imageName);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    handleChange(null, imageName);
  };

  return (
    <div
      className={` lg:h-40 h-40 w-50 border-dashed border-2 p-4 rounded-lg text-center ${
        isDragging
          ? "bg-blue-gray-200 border-blue-gray-800"
          : "bg-blue-gray-50 border-blue-gray-200"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {selectedFile ? (
        <div className="">
          <div className="rounded flex flex-col items-center justify-center">
            {selectedFile.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt={selectedFile.name}
                className="rounded h-20"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100"></div>
            )}
            <p className="w-[196px] truncate text-xs mt-2">{selectedFile.name}</p>
          </div>
          <button
            className="mt-2 bg-blue-gray-800 text-white text-xs font-medium py-1 px-3 rounded"
            onClick={handleClearFile}
          >
            Clear File
          </button>
        </div>
      ) : (
        <div className=" flex flex-col items-center justify-center gap-2">
          <button
            type="button"
            className="bg-zinc-200 text-sm font-semibold py-2 px-4 rounded"
            onClick={handleButtonClick}
          >
            <img src="/images/image-broken.png" alt="" className="w-10" />
          </button>
          <p className="text-xs text-gray-400 my-2">
            Drag and drop an image here, or click to upload
          </p>
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
  );
};

export default CustomFileInputSmall;