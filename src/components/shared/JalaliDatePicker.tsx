import React, { Dispatch, MutableRefObject, SetStateAction, useRef, useState } from 'react'
import DatePicker from 'react-multi-date-picker'
import TimePicker from 'react-multi-date-picker/plugins/time_picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import DateObject from 'react-date-object'

interface Props {
  setDate: Dispatch<any>
  date: any
  datePickerRef: MutableRefObject<any>
}
const JalaliDatePicker: React.FC<Props> = ({ date, setDate, datePickerRef }) => {
  return (
    <DatePicker
      id="date"
      ref={datePickerRef}
      value={date}
      onChange={setDate}
      calendar={persian}
      locale={persian_fa}
      format="HH:mm:ss - YYYY/MM/DD"
      minDate={new DateObject().setCalendar(persian)}
      plugins={[<TimePicker position="right" />]}
    />
  )
}

export default JalaliDatePicker
