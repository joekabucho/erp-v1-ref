import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Lots & Clusters',
    icon: 'layers-outline',
    children: [
      {
        title: 'Open',
        link: '/operations/projects/1',
      },
      {
        title: 'On track',
        link: '/operations/projects/2',
      },
      {
        title: 'Off track',
        link: '/operations/projects/3',
      },
      {
        title: 'Closed',
        link: '/operations/projects/4',
      },
    ],
  },
  {
    title: 'Setup',
    icon: 'settings-2-outline',
    link: '/operations/setup',
  },

];

  // {
  //   title: 'Charts',
  //   icon: 'pie-chart-outline',
  //   children: [
  //     {
  //       title: 'Echarts',
  //       link: '/pages/charts/echarts',
  //     },
  //     {
  //       title: '3D Charts',
  //       link: '/pages/charts/chartjs',
  //     },
  //   ],
  // },
  // {
  //   title: 'Operations',
  //   group: true,
  // },


  // {
  //   title: 'Maps',
  //   icon: 'map-outline',
  //   children: [
  //     {
  //       title: 'Kenya',
  //       link: '/operations/maps/leaflet',
  //     },
  //     {
  //       title: 'Bubble Map',
  //       link: '/operations/maps/bubble',
  //     },
  //     {
  //       title: 'Search Map',
  //       link: '/operations/maps/searchmap',
  //     },
  //   ],
  // },
  // {
  //   title: 'Create Documents',
  //   icon: 'text-outline',
  //   children: [
  //     {
  //       title: 'Word Editor',
  //       link: '/pages/editors/ckeditor',
  //     },
  //   ],
  // },


  // {
  //   title: 'Manage Users',
  //   icon: 'people-outline',
  //   children: [
  //     {
  //       title: 'Users Table',
  //       link: '/admin/smart-table',
  //     },
  //     {
  //       title: 'Create User',
  //       link: '/admin/user/0',
  //     },
  //     {
  //       title: 'Company & Divisions',
  //       link: '/admin/division',
  //     },
  //     {
  //       title: 'Departments & Teams',
  //       link: '/admin/department',
  //     },
  //     {
  //       title: 'Roles & Permission',
  //       link: '/admin/permission',
  //     },
  //   ],
  // },
  // {
  //   title: 'Admin Panel',
  //   icon: 'grid-outline',
  //   children: [
  //     {
  //       title: 'Audit Trail',
  //       link: '/admin/audit-trail',
  //     },
  //     {
  //       title: 'Login Trail',
  //       link: '/admin/login-trail',
  //     },
  //     // {
  //     //   title: 'Restore and Delete',
  //     //   link: '/admin/permission',
  //     // },
  //   ],
  // },



// {
//   title: 'Editor',
//   link: '/pages/editors/tinymce',
// },

// {
//   title: 'Contacts',
//   link: '/pages/extra-components/contacts',
// },
// {
//   title: 'Google Maps',
//   link: '/operations/maps/gmaps',
// },
// {
//   title: 'Tasks',
//   link: '/pages/layout/tasks',
// },
// {
//   title: 'Teams',
//   pathMatch: 'prefix',
//   link: '/pages/layout/tabs',
// },
// {
//   title: 'Files',
//   link: '/pages/layout/files',
// },
// {

// {
//   title: 'Calendar',
//   icon: 'calendar-outline',
//   children: [
//     {
//       title: 'Calendar',
//       link: '/pages/extra-components/calendar',
//     },
//     {
//       title: 'Calendar Kit',
//       link: '/pages/extra-components/calendar-kit',
//     },
//     {
//       title: 'Datepicker',
//       link: '/pages/extra-components/date',
//     },
//   ],
// },
// {
//   title: 'Search',
//   icon: 'search-outline',
//   link: '/pages/extra-components/search',
// },
