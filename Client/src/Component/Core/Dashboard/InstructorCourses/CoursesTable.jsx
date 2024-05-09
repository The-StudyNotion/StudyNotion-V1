import { useDispatch, useSelector } from "react-redux"
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"
import { convertSecondsToDuration } from "../../../../Util/secToDuration"
import { setCourse, setEditCourse } from "../../../../Slice/courseSlice"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import { useState } from "react"
import { FaCheck } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom"

import { formatDate } from "../../../../Service/formatDate"
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../Service/Operation/courseDetailsAPI"
import { COURSE_STATUS } from "../../../../Util/constants"
import ConfirmationModal from "../../../Common/ConfirmationModal"

export default function CoursesTable({ courses, setCourses }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const TRUNCATE_LENGTH = 30

  const handleCourseDelete = async (courseId) => {
    setLoading(true)
    await deleteCourse({ courseId: courseId }, token)
    const result = await fetchInstructorCourses(token)
    if (result) {
      setCourses(result)
    }
    setConfirmationModal(null)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="custom-loader"></div>
    )
  }


  return (
    <>
      <Table className="rounded-xl border border-richblack-800">
        <Thead >
          <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2 text-richblack-100">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
              Courses
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Duration
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Price
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Action
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No courses found
                {/* TODO: Need to change this state */}
              </Td>
            </Tr>
          ) : (
            courses?.map((course) => (
              <Tr
                key={course?._id}
                className="flex gap-x-10 border-b border-richblack-800 px-6 py-8 gap-4"
              >
                <Td colSpan={1} className="flex flex-1 gap-x-4 p-3">
                  <img
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="md:h-[148px] md:w-[220px] aspect-video rounded-lg object-cover"
                  />
                  <div className="flex flex-col gap-1 justify-between">
                    <p className="text-lg font-semibold text-richblack-5 mt-3 uppercase truncate tracking-wide">
                      {course.courseName}
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0 }} className="tracking-wider">
                      {course.courseDescription.split('\n').splice(0, 1).map((line, index) => (
                        <li key={index} style={{ display: 'flex', alignItems: 'flex-start' }} className="text-xs text-richblack-300">
                          <span style={{ marginRight: '0.5em' }}>{index + 1}.</span>
                          <span>{line.trim().substring(line.indexOf('.') + 1).trim()}</span>
                        </li>
                      ))}
                    </ul>


                    <p className="text-[12px] text-white tracking-widest uppercase lg:text-left text-center">
                      Created: {formatDate(course?.createdAt || course?.updatedAt)}
                    </p>
                    {course.status === COURSE_STATUS.DRAFT ? (
                      <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100 uppercase tracking-wider">
                        <HiClock size={14} />
                        Drafted
                      </p>
                    ) : (
                      <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100 uppercase tracking-wider">
                        <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                          <FaCheck size={8} />
                        </div>
                        Published
                      </p>
                    )}
                  </div>
                </Td>
                <Td className="text-sm font-medium text-richblack-100 mb-1 tracking-wider uppercase">
                  {course?.courseContent?.reduce((acc, sec) => {
                    sec?.subSection?.forEach(sub => {
                      acc += parseFloat(sub?.timeDuration) || 0;
                    });
                    return convertSecondsToDuration(acc);
                  }, 0)}
                </Td>

                <Td className="text-sm font-medium text-richblack-100 mb-1 tracking-wider uppercase">
                  ₹{course.price}
                </Td>
                <Td className="text-sm font-medium text-richblack-100 tracking-wider uppercase">
                  <button
                    disabled={loading}
                    onClick={() => {
                      navigate(`/dashboard/edit-course/${course._id}`);
                    }}
                    title="Edit"
                    className="pr-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300 mr- mb-"
                  >
                    <FiEdit2 size={20} />
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Do you want to delete this course?",
                        text2:
                          "All the data related to this course will be deleted",
                        btn1Text: !loading ? "Delete" : "Loading...  ",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleCourseDelete(course._id)
                          : () => { },
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => { },
                      })
                    }}
                    title="Delete"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}