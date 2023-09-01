import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';

export const hasRoleGuard: CanActivateFn = (route, state) => {
  let _router=inject(Router);
  let _commonService=inject(CommonService)
  let hasRole: any = localStorage.getItem('hasRole')
  let hasRoleData: any = JSON.parse(hasRole)
    for(let i=0; i < hasRoleData.length; i++)
    {
      if(hasRoleData[i].path == route.routeConfig?.path)
      {
        route.data.role.push(hasRoleData[i].user_category)
      }
    }
  let isLoggedIn: any = localStorage.getItem('isLoggedin')
  let localData: any = JSON.parse(isLoggedIn)
  const isAuthorized = route.data.role.find((x:any)=> x == localData.role)
  if(!isAuthorized){
    _commonService.showErrorMsg('You are not authorised!!!');
    return false;
  }else{
    return true;
  }
};
