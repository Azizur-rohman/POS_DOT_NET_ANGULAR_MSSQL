import { INavData } from '@coreui/angular';
let menu: any = localStorage.getItem('menu');
let menuData: any = menu ? JSON.parse(menu) : [];

let menuPath: any = localStorage.getItem('menuPath');
let menuPathData: any = menuPath ? JSON.parse(menuPath) : [];
export const staticNavItems: INavData[] = [
//   // {
//   //   name: 'Dashboard',
//   //   url: '/dashboard',
//   //   iconComponent: { name: 'cil-speedometer' },
//   //   badge: {
//   //     color: 'info',
//   //     text: 'NEW'
//   //   }
//   // },
//   // {
//   //   title: true,
//   //   name: 'Theme'
//   // },
//   // {
//   //   name: 'Pos',
//   //   url: '/pos',
//   //   iconComponent: { name: 'cil-file' },
//   //   children: [
//   //     // {
//   //     //   name: 'Category',
//   //     //   url: '/pos/category'
//   //     // },
//   //     // {
//   //     //   name: 'Product',
//   //     //   url: '/pos/product'
//   //     // },
//   //     // {
//   //     //   name: 'Stock Management',
//   //     //   url: '/pos/stock-management/view'
//   //     // },
//   //     // {
//   //     //   name: 'Sale',
//   //     //   url: '/pos/sale'
//   //     // },
//   //   ]
//   // },
//   // {
//   //   name: 'User Settings',
//   //   url: '/pos',
//   //   iconComponent: { name: 'cilUser' },
//   //   children: [
//   //     // {
//   //     //   name: 'User Category',
//   //     //   url: '/pos/user-category'
//   //     // },
//   //     // {
//   //     //   name: 'User',
//   //     //   url: '/pos/user'
//   //     // },
//   //     // {
//   //     //   name: 'Menu Path',
//   //     //   url: '/pos/menu-path'
//   //     // },
//   //     // {
//   //     //   name: 'User Role',
//   //     //   url: '/pos/user-role'
//   //     // },
//   //   ]
//   // },
//   // {
//   //   title: true,
//   //   name: 'Extras'
//   // },
//   // {
//   //   name: 'Pages',
//   //   url: '/login',
//   //   iconComponent: { name: 'cil-star' },
//   //   children: [
//   //     {
//   //       name: 'Login',
//   //       url: '/login'
//   //     },
//   //     {
//   //       name: 'Register',
//   //       url: '/register'
//   //     },
//   //     {
//   //       name: 'Error 404',
//   //       url: '/404'
//   //     },
//   //     {
//   //       name: 'Error 500',
//   //       url: '/500'
//   //     }
//   //   ]
//   // },
];

// Dynamically add menu items from menuData
const dynamicMenuItems = menuData.sort((a: any, b: any) => (a.menuId > b.menuId ? 1 : -1)).map((p: any) => ({
  name: p.menu_name,
  url: p.menu_path,
  children: [...p.children]
}));

// const dynamicMenuPathItems = menuPathData.map((p: any) => ({
//   name: p.menu_name,
//   url: '/pos/' + p.path
// }));
staticNavItems.push(...dynamicMenuItems)

// Add dynamic menu items to the 'User Settings' children
// staticNavItems.find(item => item.name === 'Pos')!.children!.push(...dynamicMenuPathItems);

// Export the nav items
export const navItems: INavData[] = staticNavItems;
