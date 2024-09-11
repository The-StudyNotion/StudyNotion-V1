import { useSelector } from "react-redux"

import RenderCartCourses from "./RenderCartCourses"
import RenderTotalAmount from "./RenderTotalAmount"

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart)
  const { paymentLoading } = useSelector((state) => state.course)

  if (paymentLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="spinner"></div>
      </div>
    )

  return (
    <div>

      <div className='bg-richblack-900 text-white'>
        <h2 className=' text-3xl font-medium text-richblack-5 mb-5 md:mb-10' >Cart</h2>
        <p className='font-semibold text-richblack-400 border-b border-richblack-400 pb-2' >{totalItems} Courses in Cart</p>

        <div>
          {
            !total ?
              (
                <div>
                  <p className=' text-3xl text-center text-richblack-100 mt-14' >Your cart is empty</p>
                </div>
              )
              :
              (
                <div className='flex flex-col-reverse lg:flex-row items-start mt-8 gap-x-10 gap-y-6' >
                  <RenderCartCourses />
                  <RenderTotalAmount />
                </div>
              )
          }
        </div>
      </div>
    </div>
  )
}
