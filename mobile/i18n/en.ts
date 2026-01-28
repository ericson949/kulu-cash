export default {
  common: {
    back: "Back",
    close: "Close",
    help: "Help",
    continue: "CONTINUE",
    nextStep: "NEXT STEP",
    offlineNotice: "Goal selection works <bold>offline</bold>. Your preferences will sync when you're back online.",
  },
  tabs: {
    home: "Home",
    tontines: "Tontines",
    add: "Add",
    inbox: "Inbox",
    profile: "Profile",
  },
  days: {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday"
  },
  createTontine: {
    title: "New Tontine",
    step1: "STEP 1 OF 4",
    step1Title: "Goal Selection",
    heroTitle: "What are you saving for?",
    heroSubtitle: "Select a goal to help us customize your tontine experience and gamification rewards.",
    searchPlaceholder: "Search categories...",
    goals: {
      standard: { title: "Standard", subtitle: "Default Choice" },
      home: { title: "Home Construction", subtitle: "Real estate" },
      business: { title: "Small Business", subtitle: "Scale up" },
      education: { title: "Education", subtitle: "School fees" },
      vehicle: { title: "New Vehicle", subtitle: "Mobility" },
      emergency: { title: "Emergency Fund", subtitle: "Safety net" },
      custom: { title: "Custom", subtitle: "Define your own" },
    },
    customGoal: {
      headerTitle: "Define Your Goal",
      title: "What are you saving for?",
      subtitle: "Give your tontine a name and choose an icon that represents it.",
      nameLabel: "Goal Name",
      namePlaceholder: "e.g., Dream Wedding",
      iconLabel: "Choose an Icon",
      colorLabel: "Pick a Theme Color",
      save: "Save Category"
    },
    step2: 'STEP 2 OF 4',
    step2Title: 'Logic & Timing',
    contributionType: {
        title: 'Contribution Type',
        subtitle: 'Choose how members will contribute',
        fixed: 'Fixed',
        variable: 'Type A',
        cumulative: 'Type B'
    },
    duration: {
        title: 'Duration & Bouts',
        subtitle: 'Set the timeframe and review calculation',
        startDate: 'Start Date',
        endDate: 'End Date'
    },
    cycle: {
        label: 'Calculated Cycle',
        bouts: 'Bouts',
        bout: 'bout',
        frequency: 'Frequency',
        contributionDay: 'Contribution Day'
    },
    frequency: {
        weekly: 'Weekly'
    },
    pastDate: {
        title: 'Start Date in the Past',
        desc: 'Since you started in the past, how much have you saved so far compared to the expected amount?',
        currentBalance: 'Current Savings Balance',
        expected: 'Expected',
        actual: 'Actual',
        behind: 'Behind'
    },
    catchUp: {
        title: 'Catch-up Strategy',
        info: 'Your future contributions will be slightly increased to reach your goal on time.',
        original: 'Original Amount',
        adjusted: 'Adjusted Turn'
    },

  }
};
