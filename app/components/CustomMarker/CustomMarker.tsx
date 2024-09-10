import { FC, useState } from 'react'
import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps'
import type { Profile } from '@prisma/client'

// import style from './CustomMarker.module.css'


export const CustomMarker:FC<{markerObj: Profile}> = ({markerObj}) => {
  const [infowindowOpen, setInfowindowOpen] = useState<boolean>(false)
  const [markerRef, marker] = useAdvancedMarkerRef()
  
  const latLong = (markerObj?.lat_long && JSON.parse(markerObj.lat_long).lng) ? JSON.parse(markerObj?.lat_long) : {lat: 38.910405791235846, lng:  -77.04720670636921}

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => setInfowindowOpen(true)}
        position={latLong}
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
