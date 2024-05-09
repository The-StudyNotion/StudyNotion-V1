import { useEffect, useState } from "react"
import { AiOutlineContacts, AiOutlineHome, AiOutlineLogin, AiOutlineShoppingCart } from "react-icons/ai"
import { BiCategory, BiDetail } from 'react-icons/bi'
import { BsChevronDown } from "react-icons/bs"
import { useDispatch, useSelector } from "react-redux"
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom"
import { GiHamburgerMenu } from 'react-icons/gi'
import logo from "../../Asset/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../Data/Navbar-Link"
import { apiConnector } from "../../Service/apiConnector"
import { categories } from "../../Service/apis"
import { ACCOUNT_TYPE } from "../../Util/constants"
import ProfileDropdown from "../Core/Auth/ProfileDropdown"
import { SlArrowDown, SlArrowUp } from 'react-icons/sl'
import { VscDashboard, VscSignIn, VscSignOut } from "react-icons/vsc"
import HamburgerMenu from "./HamburgerMenu"
import { logout } from "../../Service/Operation/authAPI"

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [loading2, setLoading2] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ; (async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res.data.data)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${location.pathname !== "/" ? "bg-richblack-800" : ""
        } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>
        {/* Navigation links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/catalog/:catalogName")
                        ? "text-yellow-25"
                        : "text-richblack-25"
                        }`}
                    >
                      <p className="uppercase tracking-wider">{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {(loading || !subLinks) ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks.length ? (
                          <>
                            {subLinks
                              ?.filter(
                                (subLink) => subLink?.courses?.length > 0
                              )
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p className="uppercase tracking-wider">{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${matchRoute(link?.path)
                        ? "text-yellow-25"
                        : "text-richblack-25"
                        } uppercase tracking-wider`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log In
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign Up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
        <div className='mr-4 md:hidden' >
          <GiHamburgerMenu
            onClick={() => setIsMenuModalOpen(prev => !prev)}
            className={` fill-richblack-100 `}
            fontSize={24}
          />

          <HamburgerMenu
            isMenuModalOpen={isMenuModalOpen}
            setIsMenuModalOpen={setIsMenuModalOpen}
          >
            <div className='flex flex-col gap-y-2 py-5 px-5' >
              {
                (loading || loading2) &&
                (
                  <div className='text-white font-bold'>
                    Loading ...
                  </div>
                )
              }

              {
                token === null &&
                (
                  <Link to={'/login'} onClick={() => setIsMenuModalOpen(false)}   >
                    <div className='flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-richblack-25 hover:bg-richblack-700 uppercase tracking-wider' >
                      <VscSignIn className='text-lg' />
                      Log In
                    </div>
                  </Link>
                )
              }

              {
                token === null &&
                (
                  <Link to={'/signup'} onClick={() => setIsMenuModalOpen(false)} >
                    <div className='flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-richblack-25 hover:bg-richblack-700 uppercase tracking-wider' >
                      <AiOutlineLogin className='text-lg' />
                      Sign Up
                    </div>
                  </Link>
                )
              }

              {
                token !== null &&
                (
                  <Link to={'/dashboard/my-profile'} onClick={() => setIsMenuModalOpen(false)}  >
                    <div className='flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-richblack-25 hover:bg-richblack-700 uppercase tracking-wider' >
                      <VscDashboard className='text-lg' />
                      Dashboard
                    </div>
                  </Link>
                )
              }

              {
                token !== null && user && user?.role === 'Student' &&
                (
                  <Link to={'/dashboard/cart'} onClick={() => setIsMenuModalOpen(false)}  >
                    <div className='flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-richblack-25 hover:bg-richblack-700 uppercase tracking-wider' >
                      <AiOutlineShoppingCart className='text-lg' />
                      Cart
                    </div>
                  </Link>
                )
              }

              {
                token !== null &&
                (
                  <div className='flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-richblack-25 hover:bg-richblack-700 cursor-pointer uppercase tracking-wider'
                    onClick={() => dispatch(logout(navigate))}
                  >
                    <VscSignOut className='text-lg' />
                    Log Out
                  </div>
                )
              }

              {/* General Buttons */}
              <div className='h-[1px] my-2 bg-richblack-100 w-3/4 mx-auto' ></div>

              <Link to={'/'} onClick={() => setIsMenuModalOpen(false)}   >
                <div className='flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-richblack-25 hover:bg-richblack-700 uppercase tracking-wider' >
                  <AiOutlineHome className='text-lg' />
                  Home
                </div>
              </Link>

              <Link to={'/about'} onClick={() => setIsMenuModalOpen(false)}   >
                <div className='flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-richblack-25 hover:bg-richblack-700 uppercase tracking-wider' >
                  <BiDetail className='text-lg' />
                  About
                </div>
              </Link>

              <Link to={'/contact'} onClick={() => setIsMenuModalOpen(false)} >
                <div className='flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-richblack-25 hover:bg-richblack-700 uppercase tracking-wider' >
                  <AiOutlineContacts className='text-lg' />
                  Contact
                </div>
              </Link>

              {/* Category */}
              <div className=''
                onClick={() => setCategoryOpen(prev => !prev)}
              >
                <details >
                  <summary className='flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 uppercase tracking-wider' >
                    <BiCategory className='text-lg' />
                    Category
                    {
                      categoryOpen ? <SlArrowUp className='translate-y-[1px] ml-auto mr-1' /> : <SlArrowDown className='translate-y-[1px] ml-auto mr-1' />
                    }
                  </summary>

                  <div className='px-4 text-richblack-100 ' >
                    {
                      subLinks.length ?
                        (
                          <div className='flex flex-col capitalize' >
                            {
                              subLinks.map((subLink, index) => (
                                <Link to={`/catalog/${subLink.name
                                  .split(" ")
                                  .join("-")
                                  .toLowerCase()}`} key={index} onClick={() => setIsMenuModalOpen(false)} >
                                  <p className=' rounded-lg py-2 pl-4 uppercase tracking-wider text-xs' >{subLink.name}</p>
                                </Link>
                              ))
                            }
                          </div>
                        )
                        :
                        (<div className='rounded-lg py-2 pl-4 select-none cursor-not-allowed' >No Catalog Available</div>)
                    }
                  </div>
                </details>
              </div>
            </div>
          </HamburgerMenu>
        </div>

      </div>
    </div>
  )
}

export default Navbar
