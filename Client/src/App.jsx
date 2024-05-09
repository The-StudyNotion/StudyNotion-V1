import { useEffect } from "react"
import "./App.css"
import { useDispatch, useSelector } from "react-redux"
import { Route, Routes, useNavigate } from "react-router-dom"


import Navbar from "./Component/Common/Navbar"
import OpenRoute from "./Component/Core/Auth/OpenRoute"
import PrivateRoute from "./Component/Core/Auth/PrivateRoute"
import AddCourse from "./Component/Core/Dashboard/AddCourse"
import Cart from "./Component/Core/Dashboard/Cart"
import EditCourse from "./Component/Core/Dashboard/EditCourse"
import EnrolledCourses from "./Component/Core/Dashboard/EnrolledCourses"
import Instructor from "./Component/Core/Dashboard/Instructor"
import MyCourses from "./Component/Core/Dashboard/MyCourses"
import MyProfile from "./Component/Core/Dashboard/MyProfile"
import Settings from "./Component/Core/Dashboard/Settings"
import VideoDetails from "./Component/Core/ViewCourse/VideoDetails"
import About from "./Pages/About"
import Catalog from "./Pages/Catalog"
import Contact from "./Pages/Contact"
import CourseDetails from "./Pages/CourseDetails"
import Dashboard from "./Pages/Dashboard"
import Error from "./Pages/Error"
import ForgotPassword from "./Pages/ForgotPassword"

import Home from "./Pages/Home"
import Login from "./Pages/Login"
import Signup from "./Pages/Signup"
import UpdatePassword from "./Pages/UpdatePassword"
import VerifyEmail from "./Pages/VerifyEmail"
import ViewCourse from "./Pages/ViewCourse"
import { getUserDetails } from "./Service/Operation/profileAPI"
import { ACCOUNT_TYPE } from "./Util/constants"

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.profile)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = JSON.parse(localStorage.getItem("token"))
      dispatch(getUserDetails(token, navigate))
    }

  }, [])

  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />
        <Route path="catalog/:catalogName" element={<Catalog />} />

        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/Settings" element={<Settings />} />
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/instructor" element={<Instructor />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
              <Route path="/dashboard/cart" element={<Cart />} />
            </>
          )}
          <Route path="dashboard/settings" element={<Settings />} />
        </Route>

        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  )
}

export default App
