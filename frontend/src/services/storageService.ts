import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/firebase';

export const storageService = {
  // Compress image before uploading to storage
  async compressImage(file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.85): Promise<Blob> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              resolve(blob || file);
            },
            file.type === 'image/png' ? 'image/png' : 'image/jpeg',
            quality
          );
        } else {
          resolve(file);
        }
      };
      img.onerror = () => resolve(file);
    });
  },

  // Upload radiograph / dental photo to Firebase Storage
  async uploadDentalScan(file: File, patientId: string): Promise<string> {
    try {
      const compressedBlob = await this.compressImage(file);
      const filename = `dental_scans/${patientId}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, filename);

      const snapshot = await uploadBytes(storageRef, compressedBlob, {
        contentType: file.type || 'image/jpeg',
      });

      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (err) {
      console.warn('Firebase Storage upload notice. Using local preview URL fallback:', err);
      return URL.createObjectURL(file);
    }
  },

  // Upload doctor profile picture
  async uploadDoctorProfilePicture(file: File, doctorId: string): Promise<string> {
    try {
      const compressedBlob = await this.compressImage(file, 800, 800, 0.9);
      const filename = `doctor_profiles/${doctorId}/${Date.now()}_avatar.jpg`;
      const storageRef = ref(storage, filename);

      const snapshot = await uploadBytes(storageRef, compressedBlob, {
        contentType: 'image/jpeg',
      });

      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (err) {
      console.warn('Firebase Storage upload notice:', err);
      return URL.createObjectURL(file);
    }
  },

  // Delete file from Firebase Storage
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const storageRef = ref(storage, fileUrl);
      await deleteObject(storageRef);
    } catch (err) {
      console.warn('Firebase Storage delete notice:', err);
    }
  }
};
