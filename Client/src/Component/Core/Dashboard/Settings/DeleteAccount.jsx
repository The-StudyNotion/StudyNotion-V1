import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { deleteProfile } from "../../../../Service/Operation/SettingsAPI"

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <div className=' mt-7 rounded-md border border-pink-700 bg-pink-900 p-8 px-5 md:px-12' >
      <div className='flex gap-x-5 ' >
        <div className='grid place-items-center aspect-square h-14 w-14  rounded-full bg-pink-700' >
          <FiTrash2 className='text-3xl text-pink-200' />
        </div>

        <div className='flex flex-col space-y-2 ' >
          <h2 className='text-lg font-semibold text-richblack-5 uppercase tracking-wider'>Delete Account</h2>
          <div className='lg:w-full text-pink-25 space-y-1 lg:text-lg text-md tracking-wider' >
            <p>Would you like to delete account?</p>
            <p className='tracking-wider lg:text-base text-md'>
              This account may contain paid courses. Deleting your account is permanent and will remove all the contain associated with it.
            </p>
          </div>

          <button
            type='button'
            onClick={() => handleDeleteAccount()}
            className='hidden md:block tracking-wider w-fit cursor-pointer italic bg-pink-700 py-1 px-3 rounded-md text-pink-200'>
            I want to delete my account
          </button>
        </div>
      </div>

      <div className='mt-5 grid place-items-center'>
        <button
          type='button'
          onClick={() => handleDeleteAccount()}
          className='md:hidden tracking-wider w-fit cursor-pointer italic bg-pink-700 py-1 px-3 rounded-md text-pink-200'>
          I want to delete my account
        </button>
      </div>
    </div>
  )
}
