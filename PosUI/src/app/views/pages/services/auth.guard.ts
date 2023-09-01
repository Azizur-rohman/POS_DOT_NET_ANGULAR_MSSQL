import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let _router=inject(Router);
  let isLoggedIn: any = localStorage.getItem('isLoggedin')
  let localData: any = JSON.parse(isLoggedIn)
  if(isLoggedIn == 'false'){
    _router.navigate(['login']);
    return false;
  }else{
    return true;
  }
};
