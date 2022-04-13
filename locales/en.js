export default {
  common: {
    model: {
      id: '#',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      phone: 'Phone',
      mobile: 'Mobile',
      workPhone: 'Work phone',
      mobilePhone: 'Mobile phone',
      homePhone: 'Home phone',
      creationTime: 'Creation time',
      creationDate: 'Creation date',
      address: 'Address',
      street: 'Street',
      ward: 'City / Town',
      province: 'Province',
      state: 'State',
      postalCode: 'Postcode',
      subtotal: 'Subtotal',
      total: 'Total',
      tax: 'Tax',
      to: 'to',
      codeNumber: 'Code Number'
    },
    action: {
      view: 'View',
      create: 'Create',
      update: 'Update',
      delete: 'Delete',
      cancel: 'Cancel',
      discard: 'Discard',
      filters: 'Filters',
      filter: 'Filter',
      reset: 'Reset',
      discardChange: 'Discard Change',
      apply: 'Apply'
    },
    message: {
      confirmDeletionTitle: 'Confirm Deletion',
      somethingWentWrong: 'Something Went Wrong !'
    }
  },
  login: {
    title: 'Sign In',
    usernameOrEmail: 'Username or Email',
    password: 'Password',
    button: 'Sign In',
    forgot: 'Forgot password?'
  },
  forgot: {
    title: 'Forgot Password?',
    subtitle: 'Enter your account email address and we will send you a link to reset your password.',
    emailAddress: 'Email address',
    button: 'Request Password Reset',
    back_to_login: 'Back to Login'
  },
  reset: {
    title: 'Set new password',
    resetCode: 'Reset code',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    button: 'Set new password'
  },
  menu: {
    profile: 'Profile',
    logout: 'Logout',
    dashboard: 'Dashboard',
    pages: 'Pages',
    leads: 'Leads',
    jobs: 'Jobs',
    clients: 'Clients',
    admin: 'Admin',
    users: 'Users',
    taskTemplate: 'Task Template',
    roles: 'Roles',
    setting: 'Setting',
    contacts: 'Contacts',
    workspace: 'Workspace'
  },
  contact: {
    model: {
      contactInformation: 'Contact Information',
      name: 'Name',
      contactType: 'Contact type',
      businessName: 'Business Name',
      address: 'Address',
      contactName: 'Contact Name',
      street: 'Street',
      ward: 'Ward',
      province: 'Province',
      postalCode: 'Postcode',
      types: 'Types'
    },
    action: {
      createContact: 'New Contact',
      updateContact: 'Update Contact'
    },
    message: {
      searchHint: 'e.g. filter for email, name, etc',
      confirmDeletionMessage: 'Are you sure want to delete this Contact?',
      successCreate: 'Contact has been created successfully.',
      successUpdate: 'Contact has been updated successfully.',
      successDelete: 'Contact has been deleted.'
    }
  },
  job: {
    model: {
      jobInformation: 'Jobs Information',
      name: 'Name',
      schedules: 'Schedules',
      ref: 'Ref#',
      description: 'Description',
      type: 'Type',
      taskProgress: 'Task Progress',
      customer: 'Customer',
      date: 'Date',
      types: 'Types',
      reset: 'Reset',
      tax: 'Tax',
      creationTime: 'Creation Time',
      subTasks: 'Sub Tasks',
      buildingType: 'Building Type',
      customerName: 'Customer Name',
      expectedStart: 'Expected Start',
      invoiceMethod: 'Invoice Method',
      contractTotal: 'Contract Total',
      percent: 'Markup percent you are making',
      costPlus: 'Cost Plus',
      defaultTask: 'Create Default Task',
      taxProfileName: 'Tax Profile',
      contractPriceAmount: 'Amount',
      contractPriceTotalPrice: 'Total Price',
      workLocation: 'Work Location',
      customerDetails: 'Customer Details',
      paymentInformation: 'Contract Payment',
      markupPercent: 'Markup percent you are making',
      costPlusPercent: 'Cost Plus',
      defaultTasks: 'Create Default Tasks',
      defaultInvoices: 'Create Default Invoices'
    },
    action: {
      createJob: 'New Job',
      updateJob: 'Update Job',
      viewDetail: 'Job Details',
      updatePrice: 'Update Price'
    },
    message: {
      searchHint: 'e.g. filter for ref code, description, customer name, etc',
      confirmDeletionMessage: 'Are you sure want to delete this Job?',
      successCreate: 'Job has been created successfully.',
      successUpdate: 'Job has been updated successfully.',
      successDelete: 'Job has been deleted.'
    },
    task: {
      action: {
        createTask: 'Create Task',
        updateTask: 'Update Task'
      },
      filter: {
        job: 'Job',
        status: 'Status',
        assignee: 'Assignee',
        dateRange: 'Date range'
      },
      model: {
        newTask: 'Create New Task',
        updateTask: 'Update Task',
        cleanUp: 'Clean Up',
        name: 'Task',
        startDate: 'Start Date',
        endDate: 'End Date',
        parentTask: 'Parent task',
        description: 'Description',
        duration: 'Duration',
        assignee: 'Assignee',
        reminderSetting: 'Reminder Setting',
        day: 'day(s)',
        schedules: 'Schedules',
        progress: 'Progress',
        contractAmount: 'Contract Amount',
        weekendsExcluded: 'Weekends are excluded when calculating duration',
        reminderBefore: 'Reminder before',
        notification: 'Notification',
        sms: 'SMS',
        email: 'Email',
        remindBefore: 'Remind Before',
        remindBeforeUnit: 'Remind Before Unit',
        reminderNote: 'Reminder Note',
        remindAt: 'Remind At',
        remindType: 'Remind Type',
        templateId: 'Template',
        creationTime: 'Creation date',
        job: 'Job',
        codeNumber: 'Code Number',
        unassigned: 'Unassigned'
      },
      message: {
        successUpdate: 'Task has been updated successfully.',
        searchHint: 'Search for tasks',
        confirmDeletionMessage: 'Are you sure want to remove this task?<br/>This action cannot be undone.',
        confirmParentDeletionMessage:
          'Are you sure want to remove this task?<br/><strong>This task has multiple subtasks, the subtasks will also be deleted and cannot be undone.</strong>',
        successDelete: 'Task has been deleted successfully',
        dateRangeHelp:
          '<span>Click on days to continuous select the start/end dates.</span><br/><span>Click on "Clear" button to clear selections.</span>'
      }
    }
  },
  task: {
    action: {
      updateTask: 'Update Task'
    },
    message: {
      successUpdate: 'Task has been updated successfully.'
    },
    detail: {
      nameTask: 'Name Task:',
      parentTask: 'Parent Task:',
      assignee: 'Assignee:',
      details: 'Details',
      status: 'Status:',
      progress: 'Progress:',
      dates: 'Dates',
      startDate: 'Start Date:',
      endDate: 'End Date:',
      duration: 'Duration:',
      day: 'Day(s)',
      relatedTasks: 'Related Tasks',
      reminderSetting: 'Reminder Setting',
      beforeUnit: 'Before Unit:',
      remindBefore: 'Remind Before:',
      remindAt: 'Remind At: ',
      hours: 'Hours',
      remindType: 'Remind Type',
      description: 'Description',
      subTask: 'Sub Tasks'
    },
    purchaseOrders: {
      order: 'Order #',
      description: 'Description',
      supplier: 'Supplier #',
      supplierName: 'Supplier',
      created: 'Created',
      required: 'Required',
      total: 'Total(Ex)',
      status: 'Status',
      title: 'Purchase Orders',
      addPurchaseOrder: 'Add Purchase Order',
      message: {
        confirmDeletionMessage: 'Are you sure want to delete this Purchase Order?',
        confirmDeletionNoteMessage: 'Are you sure want to delete this Note?',
        successCreate: 'Purchase Orders has been created successfully.',
        successUpdate: 'Purchase Orders has been updated successfully.',
        successDelete: 'Purchase Orders has been deleted.',
        successDeleteNote: 'Note has been deleted.'
      }
    }
  },
  taxProfile: {
    model: {
      shortCode: 'Short code',
      name: 'Profile name'
    },
    action: {
      customize: 'Customize Tax Profile'
    }
  },
  taxItem: {
    model: {
      code: 'Code',
      description: 'Description',
      rate: 'Rate',
      exempt: 'Exempt',
      type: 'Type',
      material: 'Material',
      labour: 'Labour',
      matLab: 'MatLab',
      equipment: 'Equipment',
      subcontractor: 'Subcontractor'
    }
  },
  profile: {
    name: 'Name',
    surname: 'Surname',
    userName: 'Username',
    email: 'Email',
    basicInfo: 'Basic Information',
    editAvatar: 'Edit Avatar',
    sendVerify: 'Send Verification Email',
    save: 'Save',
    enable: 'Enable',
    disable: 'Disable',
    cancel: 'Cancel',
    delete: 'Delete',
    changePassword: 'Change Password',
    currentPassword: 'Current password',
    newPassword: 'New password',
    successPassword: 'Password has been change successfully.',
    confirmNewPassword: 'Confirm new password'
  },
  role: {
    model: {
      name: 'Role name',
      isDefault: 'Default',
      permissions: 'Manage Permissions'
    },
    action: {
      createRole: 'New Role',
      updateRole: 'Update Role'
    },
    message: {
      confirmDeletionMessage: 'Are you sure want to delete this Role?',
      successCreate: 'Role has been created successfully.',
      successUpdate: 'Role has been updated successfully.',
      successDelete: 'Role has been deleted.'
    }
  },
  client: {
    model: {
      clientInformation: 'Client Information',
      name: 'Name',
      customerType: 'Client type',
      clientAddress: 'Customer Address'
    },
    action: {
      createClient: 'New Client',
      updateClient: 'Update Client'
    },
    message: {
      searchHint: 'e.g. filter for email, name, etc',
      confirmDeletionMessage: 'Are you sure want to delete this Client?',
      successCreate: 'Client has been created successfully.',
      successUpdate: 'Client has been updated successfully.',
      successDelete: 'Client has been deleted.'
    }
  },
  invoices: {
    model: {
      invoiceId: 'Invoice ID',
      description: 'Description',
      invoicedDate: 'Invoiced Date',
      dueDate: 'Due Date',
      contractPercent: 'Contract (%)',
      contractEx: 'Contract (Ex)',
      totalEx: 'Total (Ex)',
      gst: 'GST',
      status: 'Status'
    },
    action: {
      exportPdf: 'Export PDF',
      sendEmail: 'Send Email'
    }
  },
  usersAndRoles: {
    model: {
      name: 'Name',
      emailAddress: 'Email address',
      roles: 'Roles',
      user: 'User',
      role: 'Role'
    },
    action: {
      newUsersRole: 'Add users to a role',
      remove: 'Remove'
    },
    message: {
      search: 'Search',
      confirmDeletionMessage: 'Are you sure want to delete this Role?'
    }
  },
  lead: {
    model: {
      leadInformation: 'Lead Information',
      contactInformation: 'Contact Information',
      typeOfClient: 'Type of client',
      familyName: 'Family name',
      businessName: 'Business name',
      contactName: 'Contact name',
      contactType: 'Contact type',
      source: 'Client source',
      projectType: 'Project type',
      projectScope: 'Project Scope',
      buildingType: 'Building type',
      taskTemplate: 'Task template',
      budget: 'Budget',
      startDate: 'Start date',
      type: 'Type',
      ref: 'Ref#',
      stage: 'Stage',
      customer: 'Client',
      notes: 'Notes'
    },
    action: {
      createLead: 'Capture Lead',
      updateLead: 'Update Lead',
      viewDetail: 'Lead Details',
      configureLead: 'Configure Lead',
      newClient: 'New client',
      selectContact: 'Select Contact',
      createNote: 'Create new Note',
      updateNote: 'Update Note',
      projectScope: 'Project Scope',
      clientDetails: 'Client Details',
      clientProject: 'Client Project',
      publishProject: 'Publish Project',
      manageDocuments: 'Documents'
    },
    message: {
      searchHint: 'e.g. filter for email, name, etc',
      confirmDeletionMessage: 'Are you sure want to delete this Lead?',
      confirmDeletionNoteMessage: 'Are you sure want to delete this Note?',
      confirmDeletionDocumentMessage: 'Are you sure want to delete this Document?',
      successCreate: 'Lead has been created successfully.',
      successUpdate: 'Lead has been updated successfully.',
      successDelete: 'Lead has been deleted.',
      successDeleteNote: 'Note has been deleted.',
      confirmPublishMessage: 'Are you sure want to publish this Lead into Project?',
      successPublish: 'Lead has been published successfully.',
      publishProjectHint: 'If the project has won the bid, click on "Publish Project" below to start the project.',
      successPublished: 'Project has been Published'
    }
  },
  invoice: {
    action: {
      createInvoice: 'Create Invoice'
    },
    model: {
      description: 'Description',
      status: 'Status'
    },
    message: {
      confirmDeletionMessage: 'Are you sure want to delete this Invoice?',
      confirmDeletionDocumentMessage: 'Are you sure want to delete this Document?',
      successCreate: 'Invoice has been created successfully.',
      successUpdate: 'Invoice has been updated successfully.',
      successDelete: 'Invoice has been deleted.',
      successDeleteDocument: 'Document has been deleted.'
    }
  },
  taskTemplate: {
    model: {
      taskTemplateInformation: 'Task Template Information',
      name: 'Name',
      buildingType: 'Building Type',
      task: 'Task',
      taskName: ' Task Name',
      durationTask: 'Duration Task',
      subTask: 'Sub Task',
      subTaskName: 'SubTask Name',
      durationSubTask: 'Duration SubTask'
    },
    action: {
      createTaskTemplate: 'New Task Template',
      updateTaskTemplate: 'Update Task Template',
      createTask: 'Create Task',
      createSubTask: 'Create SubTask'
    },
    message: {
      confirmDeletionMessage: 'Are you sure want to delete this Task Template?',
      successCreate: 'Task Template has been created successfully.',
      successUpdate: 'Task Template has been updated successfully.',
      successDelete: 'Task Template has been deleted.'
    }
  },
  breadcrumbs: {
    home: 'Home',
    admin: 'Admin',
    adminUsers: 'Users',
    adminRoles: 'Roles',
    clients: 'Clients',
    clientsCreate: 'New Client',
    clientsEdit: 'Edit Client',
    contacts: 'Contacts',
    contactsCreate: 'New Contact',
    contactsEdit: 'Edit Contact',
    leads: 'Leads',
    leadsCreate: 'Capture Lead',
    leadsEdit: 'Edit Lead',
    jobs: 'Jobs',
    jobsCreate: 'New Job',
    jobsEdit: 'Edit Job',
    jobsId: 'Job Details',
    jobsIdSchedules: 'Schedules',
    jobsIdPurchaseOrders: 'Purchase Orders',
    jobsIdUsersAndRoles: 'Users and Roles',
    workspace: 'Workspace',
    jobsIdInvoices: 'Invoices',
    adminTaskTemplate: 'Task Template',
    adminTaskTemplateEdit: 'Task Template Detail',
    adminTaskTemplateCreate: 'New Task Template'
  },
  // Vuetify
  vuetify: {
    badge: 'Badge',
    close: 'Close',
    dataIterator: {
      noResultsText: 'No matching records found',
      loadingText: 'Loading items...'
    },
    dataTable: {
      itemsPerPageText: 'Rows per page:',
      ariaLabel: {
        sortDescending: 'Sorted descending.',
        sortAscending: 'Sorted ascending.',
        sortNone: 'Not sorted.',
        activateNone: 'Activate to remove sorting.',
        activateDescending: 'Activate to sort descending.',
        activateAscending: 'Activate to sort ascending.'
      },
      sortBy: 'Sort by'
    },
    dataFooter: {
      itemsPerPageText: 'Items per page:',
      itemsPerPageAll: 'All',
      nextPage: 'Next page',
      prevPage: 'Previous page',
      firstPage: 'First page',
      lastPage: 'Last page',
      pageText: '{0}-{1} of {2}'
    },
    datePicker: {
      itemsSelected: '{0} selected',
      nextMonthAriaLabel: 'Next month',
      nextYearAriaLabel: 'Next year',
      prevMonthAriaLabel: 'Previous month',
      prevYearAriaLabel: 'Previous year'
    },
    noDataText: 'No data available',
    carousel: {
      prev: 'Previous visual',
      next: 'Next visual',
      ariaLabel: {
        delimiter: 'Carousel slide {0} of {1}'
      }
    },
    calendar: {
      moreEvents: '{0} more'
    },
    fileInput: {
      counter: '{0} files',
      counterSize: '{0} files ({1} in total)'
    },
    timePicker: {
      am: 'AM',
      pm: 'PM'
    },
    pagination: {
      ariaLabel: {
        wrapper: 'Pagination Navigation',
        next: 'Next page',
        previous: 'Previous page',
        page: 'Goto Page {0}',
        currentPage: 'Current Page, Page {0}'
      }
    },
    rating: {
      ariaLabel: {
        icon: 'Rating {0} of {1}'
      }
    }
  },
  // VeeValidate
  validations: {
    alpha: 'The {_field_} field may only contain alphabetic characters',
    alpha_num: 'The {_field_} field may only contain alpha-numeric characters',
    alpha_dash: 'The {_field_} field may contain alpha-numeric characters as well as dashes and underscores',
    alpha_spaces: 'The {_field_} field may only contain alphabetic characters as well as spaces',
    between: 'The {_field_} field must be between {min} and {max}',
    confirmed: 'The {_field_} field confirmation does not match',
    digits: 'The {_field_} field must be numeric and exactly contain {length} digits',
    dimensions: 'The {_field_} field must be {width} pixels by {height} pixels',
    email: 'The {_field_} field must be a valid email',
    excluded: 'The {_field_} field is not a valid value',
    ext: 'The {_field_} field is not a valid file',
    image: 'The {_field_} field must be an image',
    integer: 'The {_field_} field must be an integer',
    length: 'The {_field_} field must be {length} long',
    max_value: 'The {_field_} field must be {max} or less',
    max: 'The {_field_} field may not be greater than {length} characters',
    mimes: 'The {_field_} field must have a valid file type',
    min_value: 'The {_field_} field must be {min} or more',
    min: 'The {_field_} field must be at least {length} characters',
    numeric: 'The {_field_} field may only contain numeric characters',
    oneOf: 'The {_field_} field is not a valid value',
    regex: 'The {_field_} field format is invalid',
    required_if: 'The {_field_} field is required',
    required: 'The {_field_} field is required',
    size: 'The {_field_} field size must be less than {size}KB',
    double: 'The {_field_} field must be a valid decimal',
    currency: 'The {_field_} field must be a valid currency',
    percent: 'The {_field_} field must be a valid percentage',
    maxPercent: 'The percentage must be less than or equal to {_max_}%.',
    maxAmount: 'The amount must be less than or equal to {_max_}.',
    phone: 'The {_field_} not valid.'
  }
}
