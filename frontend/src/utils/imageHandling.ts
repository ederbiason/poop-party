import { firebaseApp } from '@/firebaseConfig'
import { uploadBytes, getDownloadURL, ref, getStorage } from 'firebase/storage'

export const uploadImageAndReturnUrl = async (file: File) => {
    try {
        const storage = getStorage(firebaseApp);

        const storageRef = ref(storage, `profileImages/${file.name}`)

        const uploadResult = await uploadBytes(storageRef, file)

        const imageUrl = await getDownloadURL(uploadResult.ref)

        return imageUrl
    } catch (error: any) {
        throw new Error(error.message)
    }
}
