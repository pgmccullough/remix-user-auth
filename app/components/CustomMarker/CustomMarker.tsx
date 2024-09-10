import { FC, useState } from 'react'
import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps'

import style from './CustomMarker.module.css'

export const CustomMarker:FC<{markerObj: any}> = ({markerObj}) => {
  const [infowindowOpen, setInfowindowOpen] = useState<boolean>(false)
  const [markerRef, marker] = useAdvancedMarkerRef()
  console.log(markerObj)
  if(!markerObj?.lat_long) return(<></>)
  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => setInfowindowOpen(true)}
        position={JSON.parse(markerObj?.lat_long)}
        title={'AdvancedMarker that opens an Infowindow when clicked.'}
      />
      {infowindowOpen && (
        <InfoWindow
          anchor={marker}
          maxWidth={200}
          onCloseClick={() => setInfowindowOpen(false)}
        >
          <ul>
            <li><b>Gender:</b></li>
            <li><b>Age:</b></li>
            <li><b>Proposed Dates Hosting:</b></li>
            <li><b>Proposed Dates Travelling:</b></li>
          </ul>
          <button>Express Interest</button>
        </InfoWindow>
      )}
    </>
  )
}
