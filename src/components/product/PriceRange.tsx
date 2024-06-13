import { digitsEnToFa } from '@persian-tools/persian-tools'
import React from 'react'
import { Range, getTrackBackground } from 'react-range'

const STEP = 1
const MIN = 0

interface PriceRangeProps {
  minPrice: number | undefined
  maxPrice: number | undefined
  onPriceChange: (price: { minPrice: number; maxPrice: number }) => void
}

const PriceRange: React.FC<PriceRangeProps> = ({ minPrice, maxPrice, onPriceChange }) => {
  const [values, setValues] = React.useState<number[]>([minPrice ?? MIN, maxPrice ?? 1000000])

  React.useEffect(() => {
    setValues([minPrice ?? MIN, maxPrice ?? 1000000])
  }, [minPrice, maxPrice])

  const handleChange = (values: number[]) => {
    setValues(values)
    onPriceChange({ minPrice: values[0], maxPrice: values[1] })
  }
  return (
    <div
      className="px-2"
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Range
        values={values}
        step={STEP}
        min={MIN}
        max={maxPrice ?? 1000000}
        rtl={true}
        onChange={handleChange}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: '36px',
              display: 'flex',
              width: '100%',
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: '5px',
                width: '100%',
                borderRadius: '10px',
                background: getTrackBackground({
                  values,
                  colors: ['#ccc', '#e90089', '#ccc'],
                  min: MIN,
                  max: maxPrice ?? 1000000,
                  rtl: true,
                }),
                alignSelf: 'center',
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '22px',
              width: '22px',
              borderRadius: '50%',
              backgroundColor: '#e90089',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0px 2px 6px #AAA',
            }}
          />
        )}
      />
      {/* <output style={{ marginTop: '30px' }} id="output">
        {digitsEnToFa(values[0].toLocaleString())} - {digitsEnToFa(values[1].toLocaleString())}
      </output> */}
    </div>
  )
}

export default PriceRange
