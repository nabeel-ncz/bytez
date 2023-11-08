import React from 'react'

function CardColourLarge({status, color, onColorClick}) {
    return (
        <div className="relative w-12 h-12 flex items-center justify-center" onClick={() => {onColorClick(color)}}>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full" style={{ backgroundColor: color }} />
            {status && (
                <>
                    <img className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4" alt="Vector stroke" src="/icons/tick-white-trsp.png" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-4 border-solid rounded-full" style={{ borderColor: color }} />
                </>
            )}
        </div>
    )
}

export default CardColourLarge