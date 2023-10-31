import React from 'react'

function CardColour({ status, color }) {
    return (
        <div className="relative w-[24px] h-[24px] flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full" style={{backgroundColor:color}} />
            {status && (
                <>
                    <img className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[8px] h-[7px]" alt="Vector stroke" src="/icons/tick-white-trsp.png" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[24px] h-[24px] border-2 border-solid rounded-full"  style={{borderColor:color}} />
                </>
            )}
        </div>

    )
}

export default CardColour