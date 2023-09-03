import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Theme'
  },
  {
    name: 'Pos',
    url: '/pos',
    iconComponent: { name: 'cil-file' },
    children: [
      {
        name: 'Category',
        url: '/pos/category'
      },
      {
        name: 'Product',
        url: '/pos/product'
      },
      {
        name: 'Stock Management',
        url: '/pos/stock-management/view'
      },
      {
        name: 'Sale',
        url: '/pos/sale'
      },
    ]
  },
  {
    name: 'User Settings',
    url: '/pos',
    iconComponent: { name: 'cilUser' },
    children: [
      {
        name: 'User Category',
        url: '/pos/user-category'
      },
      {
        name: 'User',
        url: '/pos/user'
      },
      {
        name: 'Menu Path',
        url: '/pos/menu-path'
      },
      {
        name: 'User Role',
        url: '/pos/user-role'
      },
    ]
  },
  // {
  //   title: true,
  //   name: 'Extras'
  // },
  // {
  //   name: 'Pages',
  //   url: '/login',
  //   iconComponent: { name: 'cil-star' },
  //   children: [
  //     {
  //       name: 'Login',
  //       url: '/login'
  //     },
  //     {
  //       name: 'Register',
  //       url: '/register'
  //     },
  //     {
  //       name: 'Error 404',
  //       url: '/404'
  //     },
  //     {
  //       name: 'Error 500',
  //       url: '/500'
  //     }
  //   ]
  // },
];
