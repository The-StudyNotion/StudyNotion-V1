import React from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import sidebarLinks from '../../../Data/Sidebar-Link'
import SidebarLink from './SidebarLink'
import { VscSignOut } from 'react-icons/vsc'
import { logout } from "../../../Service/Operation/authAPI"
import ConfirmationModal from "../../Common/ConfirmationModal"
import { useState } from 'react'



const Sidebar = () => {
  const { token } = useSelector(state => state.auth)
  const { user } = useSelector(state => state.profile)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const modalData = {
    text1: 'Are you sure?',
    text2: 'You will be logged out of your account',
    btn1Text: 'Logout',
    btn2Text: 'Cancel',
    btn1Handler: () => dispatch(logout(navigate)),
    btn2Handler: () => setIsModalOpen(false),
    closeModalHandler: () => setIsModalOpen(false),
  }

  return (
    <div className='bg-richblack-800 ' >
      <div className='flex flex-col w-fit md:min-w-[220px] min-h-[calc(100vh-3.5rem)] border-r border-richblack-700 py-10' >
        <div className='flex flex-col' >
          {
            sidebarLinks.map((link) => {
              if (link.type && link.type !== user?.accountType) return null;
              return <SidebarLink key={link.id} data={link} />
            })
          }
        </div>

        <div className='mx-auto my-6 h-[1px] w-10/12 bg-richblack-700' ></div>


        <div>
          <SidebarLink
            data={{
              name: 'Setting',
              path: '/dashboard/settings',
              icon: 'VscSettingsGear'
            }}
          />
        </div>

        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className='flex gap-x-2 items-center text-sm font-medium px-3 md:px-8 py-2 text-richblack-300'
          >
            <VscSignOut className='text-lg' />
            <span className='hidden md:block tracking-wider uppercase' >Logout</span>
          </button>
        </div>

      </div>

      {
        isModalOpen && <ConfirmationModal modalData={modalData} />
      }
    </div>
  )
}

export default Sidebar