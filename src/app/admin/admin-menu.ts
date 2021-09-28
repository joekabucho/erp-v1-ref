import {NbMenuItem} from '@nebular/theme';

export const ADMINMENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Manage Users',
    icon: 'people-outline',
    children: [
      {
        title: 'Users Table',
        link: '/admin/smart-table',
      },
      {
        title: 'Create User',
        link: '/admin/user/0',
      },
      {
        title: 'Company & Divisions',
        link: '/admin/division',
      },
      {
        title: 'Departments & Teams',
        link: '/admin/department',
      },
      {
        title: 'Roles & Permission',
        link: '/admin/permission',
      },
    ],
  },
  {
    title: 'Subcontructors',
    link: '/admin/subcontructor',
    icon: 'award-outline',
  },
  {
    title: 'Admin Panel',
    icon: 'grid-outline',
    children: [
      {
        title: 'Audit Trail',
        link: '/admin/audit-trail',
      },
      {
        title: 'Login Trail',
        link: '/admin/login-trail',
      },
      // {
      //   title: 'Restore and Delete',
      //   link: '/admin/permission',
      // },
    ],
  },
  {
    title: 'SLA Policies',
    icon: 'briefcase-outline',
    children: [
      {
        title: 'All SLAs',
        link: '/admin/sla',
      },
      {
        title: 'Create new',
        link: '/admin/sla/new',
      },
    ],

  },
];
