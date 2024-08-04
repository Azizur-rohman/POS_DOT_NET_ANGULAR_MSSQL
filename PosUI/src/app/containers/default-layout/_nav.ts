import { INavData } from '@coreui/angular';
let menu: any = localStorage.getItem('menu');
let menuData: any = menu ? JSON.parse(menu) : [];
// setInterval(() => {
//   menu = localStorage.getItem('menu');
//   menuData = menu ? JSON.parse(menu) : [];
// }, 1000);
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
const dynamicMenuItems = menuData?.map((p: any) => ({
  name: p.menu_name,
  url: p.menu_path,
  children: [...p.children],
  iconComponent: { name: p.iconComponent ? p.iconComponent : null },
  badge: {
      color: p.badgeColor ? p.badgeColor : null,
      text: p.badgeText ? p.badgeText : null
    },
  title: p.title ? p.title : null
}));

// const dynamicMenuPathItems = menuPathData.map((p: any) => ({
//   name: p.menu_name,
//   url: '/pos/' + p.path
// }));
if (dynamicMenuItems) {
  staticNavItems.push(...dynamicMenuItems);
}

// Add dynamic menu items to the 'User Settings' children
// staticNavItems.find(item => item.name === 'Pos')!.children!.push(...dynamicMenuPathItems);

// Export the nav items
export const navItems: INavData[] = staticNavItems;
