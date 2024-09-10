import type { FC, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { APIProvider, Map, MapCameraChangedEvent } from '@vis.gl/react-google-maps'

export const MapWrapper: FC<{ 
    apiKey: string,
    children: ReactNode,
    initCenter: {lat: number, lng: number},
    initZoom: number
}> = ({ apiKey, children, initCenter, initZoom }) => {
  const [ renderReady, setRenderReady ] = useState<boolean>(false)
  const [ mapCenter, setMapCenter ] = useState<{lat: number, lng: number}>(initCenter)
  const [ mapZoom, setMapZoom] = useState<number>(initZoom)

  useEffect(() => {
    setRenderReady(true)
  }, [])

  return (
    <APIProvider 
      apiKey={apiKey} 
      onLoad={() => console.log('Maps API has loaded.')}
    >
      <div style={{width: '100%', minHeight: '400px', height: '30vh'}}>
        { 
          renderReady ? (
            <Map
              defaultZoom={mapZoom}
              defaultCenter={mapCenter}
              mapId="CURRENT_USER_PIN"
              onCameraChanged={(ev: MapCameraChangedEvent) => {
                setMapCenter(ev.detail.center)
                setMapZoom(ev.detail.zoom)
              }}
              zoom={mapZoom}
            >
              {children}
            </Map>
          ) : (
            <>Loading Map...</>
          )
        }
      </div>
    </APIProvider>
  )
}
