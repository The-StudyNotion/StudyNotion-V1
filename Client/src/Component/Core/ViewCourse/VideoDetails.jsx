import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import "video-react/dist/video-react.css"
import { useLocation } from "react-router-dom"
import { BigPlayButton, ControlBar, CurrentTimeDisplay, ForwardControl, LoadingSpinner, PlaybackRateMenuButton, Player, ReplayControl, TimeDivider } from "video-react"

import { markLectureAsComplete } from "../../../Service/Operation/courseDetailsAPI"
import { updateCompletedLectures } from "../../../Slice/viewCourseSlice"
import IconBtn from "../../Common/IconBtn"
import { BiSkipNextCircle, BiSkipPreviousCircle } from "react-icons/bi"
import { MdOutlineReplayCircleFilled } from "react-icons/md"

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState([])
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ; (async () => {
      if (!courseSectionData.length) return
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`)
      } else {

        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        )

        const filteredVideoData = filteredData?.[0]?.subSection.filter(
          (data) => data._id === subSectionId
        )

        setVideoData(filteredVideoData[0])
        setPreviewSource(courseEntireData.thumbnail)
        setVideoEnded(false)
      }
    })()
  }, [courseSectionData, courseEntireData, location.pathname])


  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSectionIndx === 0 && currentSubSectionIndx === 0) {
      return true
    } else {
      return false
    }
  }


  const goToNextVideo = () => {


    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)



    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx + 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      )
    } else {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id
      const nextSubSectionId =
        courseSectionData[currentSectionIndx + 1].subSection[0]._id
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      )
    }
  }


  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    ) {
      return true
    } else {
      return false
    }
  }


  const goToPrevVideo = () => {


    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id
      const prevSubSectionLength =
        courseSectionData[currentSectionIndx - 1].subSection.length
      const prevSubSectionId =
        courseSectionData[currentSectionIndx - 1].subSection[
          prevSubSectionLength - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      )
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  return (
    <div className='md:w-[calc(100vw-320px)] w-screen p-3'>
      {
        !videoData ? <h1>Loading...</h1> :
          (
            <div className="">
              <Player className="w-full relative"
                ref={playerRef}
                src={videoData.videoUrl}
                aspectRatio="16:9"
                fluid={true}
                autoPlay={false}
                onEnded={() => setVideoEnded(true)}
              >

                <BigPlayButton position="center" />

                <LoadingSpinner />
                <ControlBar>
                  <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1} />
                  <ReplayControl seconds={5} order={7.1} />
                  <ForwardControl seconds={5} order={7.2} />
                  <TimeDivider order={4.2} />
                  <CurrentTimeDisplay order={4.1} />
                  <TimeDivider order={4.2} />
                </ControlBar>
                {
                  videoEnded && (
                    <div className='flex justify-center items-center'>
                      <div className='flex justify-center items-center'>
                        {
                          !completedLectures.includes(videoData._id) && (
                            <button onClick={() => { handleLectureCompletion() }} className='bg-yellow-100 text-richblack-900 absolute top-[20%] hover:scale-90 z-20 font-medium md:text-sm px-4 py-2 rounded-md'>Mark as Completed</button>
                          )
                        }
                      </div>
                      {
                        !isFirstVideo() && (
                          <div className=' z-20 left-0 top-1/2 transform -translate-y-1/2 absolute m-5'>
                            <BiSkipPreviousCircle onClick={goToPrevVideo} className=" text-2xl md:text-5xl bg-richblack-600 rounded-full cursor-pointer hover:scale-90" />
                            {/* <button onClick={previousLecture} className='bg-blue-500 text-white px-4 py-2 rounded-md'>Previous Lecture</button> */}
                          </div>
                        )

                      }
                      {
                        !isLastVideo() && (
                          <div className=' z-20 right-4 top-1/2 transform -translate-y-1/2 absolute m-5'>
                            <BiSkipNextCircle onClick={goToNextVideo} className="text-2xl md:text-5xl bg-richblack-600 rounded-full cursor-pointer hover:scale-90" />
                            {/* <button onClick={nextLecture} className='bg-blue-500 text-white px-4 py-2 rounded-md'>Next Lecture</button> */}
                          </div>
                        )
                      }
                      {
                        <MdOutlineReplayCircleFilled onClick={() => { playerRef.current.seek(0); playerRef.current.play(); setVideoEnded(false) }} className="text-2xl md:text-5xl bg-richblack-600 rounded-full cursor-pointer hover:scale-90 absolute top-1/2 z-20" />
                      }
                    </div>
                  )
                }
              </Player>
            </div>
          )
      }
      {/* video title and desc */}
      <div className='mt-5'>
        <h1 className='text-2xl font-bold text-richblack-25'>{videoData?.title}</h1>
        <p className='text-gray-500 text-richblack-100'>{videoData?.description}</p>
      </div>
    </div>
  )
}


export default VideoDetails

