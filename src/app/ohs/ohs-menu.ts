import { NbMenuItem } from '@nebular/theme';

export const OHSMENU_ITEMS: NbMenuItem[] = [
  // {
  //   title: 'Health and Safety',
  //   icon: 'people-outline',
  //   home: true,
  //   expanded: true,
  //   children: [
  //   ],
  // },

  {
    title: 'Dashboard',
    link: '/ohs/d3',
    icon: 'pie-chart-outline',
  },
  {
    title: 'Jobs/Tickets',
    link: '/ohs/job',
    home: true,
    icon: 'briefcase-outline',
  },
  {
    title: 'Permits To Work',
    icon: 'award-outline',
    link: '/ohs/workpermits',
  },
  {
    title: 'Site Inspections',
    icon: 'clipboard-outline',
    expanded: false,
    children: [
      {
        title: 'Safety management checklist',
        link: '/ohs/site-inspection',
      },
      {
        title: 'Positive behaviour observation',
        link: '/ohs/positive-safety-observation',
      },
      ],
  },
  {
    title: 'Reports',
    icon: 'printer-outline',
    expanded: false,
    children: [
      {
        title: 'Job Hazard Analysis',
        link: '/ohs/hazard-analysis',
      },
      {
        title: 'Safety Inductions',
        link: '/ohs/safety-inductions',
      },
      {
        title: 'Safety Communication Plans',
        link: '/ohs/safety-communication-plans',
      },
      {
        title: 'Toolbox Talks',
        link: '/ohs/toolbox-talks',
      },
      {
        title: 'Incidents',
        link: '/ohs/job-incident',
      },
      {
        title: 'Resources',
        link: '/ohs/document',
      },
    ],
  },
  {
    title: 'Setup',
    link: '/ohs/setup',
    icon: 'settings-2-outline',
  },
];
