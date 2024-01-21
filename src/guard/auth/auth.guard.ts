import { StorageService } from '../../services/storage/storage.service';
import { inject } from '@angular/core';

export const authGuard = () => {
  console.log('authGuard#canActivate called')

  const storageService = inject(StorageService)

  const admin = storageService.getUser()

  const role = admin.roles[1]

  if (role) {
    return true 
  } 
  return false


}