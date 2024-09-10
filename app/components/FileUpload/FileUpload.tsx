import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { unstable_createFileUploadHandler } from '@remix-run/node'
const UploadContext = createContext({
  uploadProgress: 0,
  uploadError: null,
  handleFileUpload: () => {}
})

export function UploadProvider({ children }: { children: ReactNode }) {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState(null)

  const handleFileUpload = async (file: File) => {
    const uploadHandler = unstable_createFileUploadHandler({
      maxPartSize: 10_000_000, // 10MB limit
      directory: publicEnv.UPLOAD_DIR, // Upload directory (e.g., 'public/uploads')
      file: (info) => info.name // Keep original filename
    })
  
    const uploadResult = await uploadHandler(file)
  
    console.log('Upload Result?', uploadResult)
  }
  

  return (
    <UploadContext.Provider value={{ uploadProgress, uploadError, handleFileUpload }}>
      {children}
    </UploadContext.Provider>
  )
}

export function useUpload() {
  return useContext(UploadContext)
}
