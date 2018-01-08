const dummyData = {
  roles: [
    { id: 0, title: 'Engineer' },
    { id: 1, title: 'Client Service' },
    { id: 2, title: 'Admin' },
    { id: 3, title: 'Sales' },
    { id: 4, title: 'Content' },
    { id: 5, title: 'DevOps' },
    { id: 6, title: 'SupportOps' },
    { id: 7, title: 'Board' },
  ],
  productAreas: [
    { id: 0, title: 'Policy Administration' },
    { id: 1, title: 'Claims Management' },
    { id: 2, title: 'Rules and Rating' },
    { id: 3, title: 'Reports and Extracts' },
    { id: 4, title: 'Contact Management' },
    { id: 5, title: 'Billing' },
    { id: 6, title: 'Imaging and Printing' },
    { id: 7, title: 'Settings' },
    { id: 8, title: 'Agent Quoting and Inquiry' },
  ],
  clients: [
    {
      id: 0,
      name: 'Bankers Life & Casualty Company',
      featureRequests: [
        {
          id: 0,
          title: 'Reports are not correct',
          description: 'Resports for Claims management are not accurate.',
          priority: 1,
          productArea: 0,
          user: 1,
        },
        {
          id: 1,
          title: 'Can not edit custom Rules',
          description: 'After creation of custom Rules, I am unable to either edit or delete new custom Rule.',
          priority: 2,
          productArea: 2,
          user: 1,
        },
        {
          id: 2,
          title: 'Add social media management to Contact Management',
          description: 'Currently not able to add client social media accounts.',
          priority: 3,
          productArea: 4,
          user: 2,
        },
      ],
    },
    {
      id: 1,
      name: 'eGlobal Health Insurers Agency',
    },
    {
      id: 2,
      name: 'Great American name Insurance Agency',
    },
    {
      id: 3,
      name: 'Kern Insurance Services',
    },
    {
      id: 4,
      name: 'LaTour Advisory Group',
    },
    {
      id: 5,
      name: 'Art Cambridge Financial Services',
    },
    {
      id: 6,
      name: 'Barker Phillips Jackson',
    },
    {
      id: 7,
      name: 'Tagge Inurance Agency',
    },
    {
      id: 8,
      name: 'Medical Benefits Group',
    },
  ],
};

export default dummyData;
