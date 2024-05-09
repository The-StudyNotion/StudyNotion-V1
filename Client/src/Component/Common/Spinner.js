import React from 'react'

const Spinner = () => {
  return (
    <div className='mx-auto flex flex-col justify-center h-[calc(100%)] items-center'>
      <div className='spinner'></div>
      <h1 className='font-semibold mt-2 text-richblack-100'>Loading...</h1>
    </div>
  )
}

export default Spinner