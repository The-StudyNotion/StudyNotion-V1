import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { fetchInstructorCourses } from "../../../Service/Operation/courseDetailsAPI"
import IconBtn from "../../Common/IconBtn"
import CoursesTable from "./InstructorCourses/CoursesTable"
import Spinner from "../../Common/Spinner"

export default function MyCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector(state => state.auth)

  useEffect(() => {

    const fetchCourses = async () => {
      setLoading(true);
      const result = await fetchInstructorCourses(token);
      if (result) {
        setCourses(result);
      }
      setLoading(false);
    }
    fetchCourses();
  }, [token]);

  return (
    <div>
      <div className='flex flex-col md:flex-row md:justify-between md:items-center mb-14 gap-y-5' >
        <h1 className='text-3xl font-medium text-richblack-5 lg:text-left text-center uppercase tracking-wider' >My Courses</h1>
        <div className='hidden md:block'>
          <IconBtn
            type="btn"
            text="Add Course"
            customClasses="hidden md:block uppercase tracking-wider"
            onClickHandler={() => navigate("/dashboard/add-course")}
          >
            <VscAdd />
          </IconBtn>
        </div>


        <div className='md:hidden'>
          <IconBtn
            type="btn"
            text="Add Course"
            customClasses="w-full md:w-0 my-5 !py-1 text-center grid place-items-center uppercase tracking-wider"
            onClickHandler={() => navigate("/dashboard/add-course")}
          >
            <VscAdd />
          </IconBtn>
        </div>
      </div>

      <div >
        {
          loading ?
            (
              <div>
                <Spinner />
              </div>
            )
            :
            !courses || courses.length === 0 ?
              (
                <div>
                  <div className='h-[1px] mb-10  mx-auto bg-richblack-500' ></div>
                  <p className='text-center text-2xl font-medium text-richblack-100 select-none' >No Courses Found</p>
                </div>
              )
              :
              <CoursesTable courses={courses} setCourses={setCourses} />
        }
      </div>


    </div>
  )
}
