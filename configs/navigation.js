export default {
  // main navigation - side menu
  menu: [
    {
      key: '',
      text: '',
      permission: ['Pages.Tenant.Dashboard'],
      items: [
        {
          icon: 'mdi-view-dashboard-outline',
          key: 'menu.dashboard',
          text: 'Dashboard',
          link: '/dashboard'
        }
      ]
    },
    {
      key: '',
      text: '',
      permission: ['Pages.Jobs.Tasks'],
      items: [
        {
          icon: 'mdi-calendar-check-outline',
          key: 'menu.workspace',
          text: 'Workspace',
          link: '/workspace'
        }
      ]
    },
    {
      key: 'menu.pages',
      text: 'Pages',
      permission: [
        'Pages.Administration.Leads',
        'Pages.Administration.Jobs',
        'Pages.Administration.Customers',
        'Pages.Administration.Contacts'
      ],
      items: [
        {
          icon: 'mdi-view-column-outline',
          key: 'menu.leads',
          text: 'Leads',
          link: '/leads',
          permission: ['Pages.Administration.Leads']
        },
        {
          icon: 'mdi-format-list-checkbox',
          key: 'menu.jobs',
          text: 'Jobs',
          link: '/jobs',
          permission: ['Pages.Administration.Jobs']
        },
        {
          icon: 'mdi-account-box-multiple-outline',
          key: 'menu.clients',
          text: 'Clients',
          link: '/clients',
          permission: ['Pages.Administration.Customers']
        },
        {
          icon: 'mdi-card-account-mail-outline',
          key: 'menu.contacts',
          text: 'Contacts',
          link: '/contacts',
          permission: ['Pages.Administration.Contacts']
        }
      ]
    },
    {
      key: 'menu.admin',
      text: 'Admin',
      permission: ['Pages.Administration'],
      items: [
        {
          icon: 'mdi-account-multiple-outline',
          key: 'menu.users',
          text: 'Users',
          permission: ['Pages.Administration.Users'],
          link: '/admin/users'
        },
        {
          icon: 'mdi-shield-key-outline',
          key: 'menu.roles',
          text: 'Roles',
          permission: ['Pages.Administration.Roles'],
          link: '/admin/roles'
        },
        {
          icon: 'mdi-television-guide',
          key: 'menu.taskTemplate',
          text: 'Task Template',
          permission: ['Pages.Administration.Users'],
          link: '/admin/task-template'
        }
        // {
        //   icon: 'mdi-cog-outline',
        //   key: 'menu.setting',
        //   text: 'Setting',
        //   permission: ['Pages.Administration.Tenant.Settings'],
        //   link: '/admin/setting'
        // }
      ]
    }
  ],

  // footer links
  footer: [
    // {
    //   key: 'menu.docs',
    //   text: 'Docs',
    //   href: 'https://vuetifyjs.com',
    //   target: '_blank'
    // }
  ]
}
