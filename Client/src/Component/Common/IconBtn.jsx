import React from 'react'

const IconBtn = ({ ...btnData }) => {

  const { children, text, onClickHandler, disabled, outline = false, customClasses, type } = btnData;

  return (
    <div className='text-white' >
      <button
        onClick={onClickHandler}
        disabled={disabled}
        type={type}
        className={` ${customClasses} rounded-md py-1 px-2 font-semibold text-richblack-900 uppercase tracking-wider
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${outline ? 'border border-yellow-50 bg-transparent' : 'bg-yellow-50'}
        `}
      >
        {
          children ?
            (
              <div className={`flex items-center gap-x-2 
              ${outline && 'text-yellow-50'}
              `} >
                {text}
                {children}
              </div>
            )
            :
            (<div>{text}</div>)
        }
      </button>
    </div>
  )
}

export default IconBtn