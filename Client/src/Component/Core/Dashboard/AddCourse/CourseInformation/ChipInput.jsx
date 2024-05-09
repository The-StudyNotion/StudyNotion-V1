
import { useEffect, useState } from "react"

import { MdClose } from "react-icons/md"
import { useSelector } from "react-redux"


export default function ChipInput({

  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)


  const [chips, setChips] = useState([])

  useEffect(() => {
    if (editCourse) {

      setChips(course?.tag)
    }
    register(name, { required: true, validate: (value) => value.length > 0 })

  }, [])

  useEffect(() => {
    setValue(name, chips)

  }, [chips])


  const handleKeyDown = (event) => {

    if (event.key === "Enter" || event.key === ",") {

      event.preventDefault()

      const chipValue = event.target.value.trim()

      if (chipValue && !chips.includes(chipValue)) {

        const newChips = [...chips, chipValue]
        setChips(newChips)
        event.target.value = ""
      }
    }
  }


  const handleDeleteChip = (chipIndex) => {

    const newChips = chips.filter((_, index) => index !== chipIndex)
    setChips(newChips)
  }


  return (
    <div className="flex flex-col space-y-2">
      {/* Render the label for the input */}
      <label className="text-sm text-richblack-5 uppercase tracking-wider" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>
      {/* Render the chips and input */}
      <div className="flex w-full flex-wrap gap-y-2">
        {/* Map over the chips array and render each chip */}
        {chips.map((chip, index) => (
          <div
            key={index}
            className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5"
          >
            {/* Render the chip value */}
            {chip}
            {/* Render the button to delete the chip */}
            <button
              type="button"
              className="ml-2 focus:outline-none"
              onClick={() => handleDeleteChip(index)}
            >
              <MdClose className="text-sm" />
            </button>
          </div>
        ))}
        {/* Render the input for adding new chips */}
        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="form-style w-full placeholder:uppercase placeholder:tracking-wider placeholder:text-sm"
        />
      </div>
      {/* Render an error message if the input is required and not filled */}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}
