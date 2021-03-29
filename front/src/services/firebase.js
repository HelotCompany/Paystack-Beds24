import { auth } from '@/pluging/firebase';

export default function getCurrentUser() {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(function(user) {
      if (user) {
        resolve({
          email: user.email,
          uid: user.uid
        })
      } else {
        reject(null)
      }
    });
  })
}