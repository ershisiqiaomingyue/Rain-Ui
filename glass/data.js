/* Rain — demo dataset.
   Every headline figure is derived from these rows (see Rain.decorate).
   Nothing that appears twice on screen is typed twice. */
(function () {
  'use strict';

  const projects = [
    {
      id: 'kretya',
      name: 'Kretya',
      scope: 'Team · 6 members',
      initials: 'K',
      daily: [24, 31, 28, 46, 52, 38, 67],
      priorDaily: [14, 17, 16, 20, 22, 15, 18],
      note: 'Wednesday’s spike is the policy rollout going live.',
      workflows: [
        {
          id: 'invoice-expense',
          name: 'Invoice & Expense Review',
          trigger: 'Telegram · Messages',
          kind: 'telegram',
          owner: 'MK',
          runs: 118,
          failures: 1,
          medianSeconds: 2.4,
          minutesSaved: 3,
          lastRun: '12 min ago',
        },
        {
          id: 'financial-prep',
          name: 'Financial Prep',
          trigger: 'Schedule · Weekdays 07:00',
          kind: 'schedule',
          owner: 'JW',
          runs: 74,
          failures: 1,
          medianSeconds: 3.4,
          minutesSaved: 2,
          lastRun: '1 h ago',
        },
        {
          id: 'policy-rollout',
          name: 'Policy Rollout',
          trigger: 'Webhook · Policy updated',
          kind: 'webhook',
          owner: 'AS',
          runs: 52,
          failures: 0,
          medianSeconds: 1.8,
          minutesSaved: 4,
          lastRun: '3 h ago',
        },
        {
          id: 'vendor-onboarding',
          name: 'Vendor Onboarding',
          trigger: 'Telegram · Inline query',
          kind: 'telegram',
          owner: 'MK',
          runs: 28,
          failures: 0,
          medianSeconds: 2.6,
          minutesSaved: 3,
          lastRun: 'Yesterday',
        },
        {
          id: 'weekly-digest',
          name: 'Weekly Digest',
          trigger: 'Schedule · Fri 16:00',
          kind: 'schedule',
          owner: 'RS',
          runs: 14,
          failures: 0,
          medianSeconds: 1.2,
          minutesSaved: 2,
          lastRun: 'Friday',
        },
      ],
      approvals: [
        {
          id: 'ap-4821',
          title: 'Invoice #4821',
          who: 'Nordwind Studio',
          amount: 1240,
          age: '3 h',
          workflowId: 'invoice-expense',
          note: 'Q4 brand refresh · 12 seats',
        },
        {
          id: 'ap-4818',
          title: 'Expense claim',
          who: 'Mia Okafor',
          amount: 86,
          age: '5 h',
          workflowId: 'invoice-expense',
          note: 'Client dinner · 4 people',
        },
      ],
      executions: [
        { id: 'RUN-1042', workflowId: 'invoice-expense', started: '14:18', duration: 2.1, status: 'succeeded' },
        { id: 'RUN-1041', workflowId: 'policy-rollout', started: '14:02', duration: 1.9, status: 'succeeded' },
        {
          id: 'RUN-1040',
          workflowId: 'financial-prep',
          started: '13:47',
          duration: 4.1,
          status: 'failed',
          note: 'Sheets token expired',
        },
        { id: 'RUN-1039', workflowId: 'invoice-expense', started: '13:20', duration: 2.4, status: 'succeeded' },
        { id: 'RUN-1038', workflowId: 'vendor-onboarding', started: '12:56', duration: 3.0, status: 'succeeded' },
        { id: 'RUN-1037', workflowId: 'invoice-expense', started: '12:31', duration: 2.2, status: 'succeeded' },
        { id: 'RUN-1036', workflowId: 'financial-prep', started: '11:48', duration: 3.6, status: 'succeeded' },
        { id: 'RUN-1035', workflowId: 'weekly-digest', started: '11:02', duration: 1.3, status: 'succeeded' },
      ],
    },
    {
      id: 'asal',
      name: 'Asal Design',
      scope: 'Team · 3 members',
      initials: 'A',
      daily: [1, 2, 1, 2, 1, 3, 3],
      priorDaily: [1, 1, 0, 2, 1, 1, 2],
      note: 'Two runs a day on average while the brand system settles.',
      workflows: [
        {
          id: 'asset-sync',
          name: 'Brand Asset Sync',
          trigger: 'Webhook · Figma published',
          kind: 'webhook',
          owner: 'AS',
          runs: 9,
          failures: 0,
          medianSeconds: 1.6,
          minutesSaved: 4,
          lastRun: '2 h ago',
        },
        {
          id: 'feedback-digest',
          name: 'Client Feedback Digest',
          trigger: 'Schedule · Mon 09:00',
          kind: 'schedule',
          owner: 'LN',
          runs: 4,
          failures: 0,
          medianSeconds: 2.2,
          minutesSaved: 3,
          lastRun: 'Monday',
        },
      ],
      approvals: [],
      executions: [
        { id: 'RUN-0512', workflowId: 'asset-sync', started: '12:40', duration: 1.5, status: 'succeeded' },
        { id: 'RUN-0511', workflowId: 'feedback-digest', started: '09:02', duration: 2.0, status: 'succeeded' },
      ],
    },
  ];

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const decorate = (project) => {
    const runs = project.workflows.reduce((total, wf) => total + wf.runs, 0);
    const failures = project.workflows.reduce((total, wf) => total + wf.failures, 0);
    const succeeded = runs - failures;
    const priorRuns = project.priorDaily.reduce((total, n) => total + n, 0);
    const minutesSaved = project.workflows.reduce((total, wf) => total + wf.runs * wf.minutesSaved, 0);
    const delta = runs - priorRuns;

    return Object.assign({}, project, {
      runs,
      failures,
      succeeded,
      priorRuns,
      delta,
      deltaPct: priorRuns === 0 ? 0 : (delta / priorRuns) * 100,
      successRate: runs === 0 ? 0 : (succeeded / runs) * 100,
      minutesSaved,
      savedLabel: `${Math.floor(minutesSaved / 60)} h ${String(minutesSaved % 60).padStart(2, '0')} m`,
      today: project.daily[project.daily.length - 1],
      lastWeekday: weekdays[weekdays.length - 1],
      weekdays,
    });
  };

  const data = projects.map(decorate);

  // The screen shows one number in the page header, on the KPI and in the
  // chart. These keep the copies honest if the sample data is edited.
  data.forEach((p) => {
    const sum = p.daily.reduce((total, n) => total + n, 0);
    console.assert(
      sum === p.runs,
      `${p.name}: the daily series (${sum}) must equal the workflow runs (${p.runs})`,
    );
    console.assert(p.daily.length === 7, `${p.name}: the series needs one value per day`);
    console.assert(p.succeeded + p.failures === p.runs, `${p.name}: succeeded + failed must equal runs`);
    console.assert(
      p.workflows.every((wf) => wf.failures <= wf.runs),
      `${p.name}: a workflow cannot fail more often than it runs`,
    );
  });

  const overall = data.find((p) => p.id === 'kretya');

  window.RAIN = {
    projects: data,
    weekdays,
    // The project the screenshot opens on.
    activeProjectId: overall.id,
    // Flows drawn on the builder canvas.
    flows: {
      'invoice-expense': {
        nodes: [
          {
            id: 'trigger',
            kind: 'telegram',
            app: 'Telegram',
            title: 'Messages received',
            badge: 'Trigger',
            x: 36,
            y: 96,
            rows: [
              { label: 'Filter', value: 'Has attachment' },
            ],
          },
          {
            id: 'condition',
            kind: 'condition',
            app: 'Condition',
            title: 'Amount over $500',
            badge: 'Branch',
            x: 388,
            y: 64,
            rows: [{ label: 'Amount', value: '≥ $500' }],
          },
          {
            id: 'approval',
            kind: 'approval',
            app: 'Approval',
            title: 'Finance review',
            badge: 'Human step',
            x: 388,
            y: 330,
            rows: [{ label: 'Reviewer', value: 'Mia K. · Finance' }],
          },
          {
            id: 'notify',
            kind: 'telegram',
            app: 'Telegram',
            title: 'Post to #finance',
            badge: 'Action',
            x: 742,
            y: 200,
            rows: [{ label: 'Channel', value: '#finance-updates' }],
          },
        ],
        edges: [
          { from: 'trigger', to: 'condition' },
          { from: 'condition', to: 'approval', label: 'over $500' },
          { from: 'condition', to: 'notify', label: 'under $500' },
          { from: 'approval', to: 'notify', label: 'approved' },
        ],
      },

      'financial-prep': {
        nodes: [
          {
            id: 'trigger',
            kind: 'schedule',
            app: 'Schedule',
            title: 'Weekday morning',
            badge: 'Trigger',
            x: 36,
            y: 120,
            rows: [
              { label: 'Runs on', value: 'Weekdays' },
              { label: 'Time', value: '07:00' },
            ],
          },
          {
            id: 'pull',
            kind: 'sheets',
            app: 'Google Sheets',
            title: 'Read September actuals',
            badge: 'Action',
            x: 330,
            y: 120,
            rows: [
              { label: 'Sheet', value: 'Actuals 2025' },
              { label: 'Range', value: 'A1:F240' },
            ],
          },
          {
            id: 'variance',
            kind: 'condition',
            app: 'Condition',
            title: 'Variance over 10%',
            badge: 'Branch',
            x: 624,
            y: 96,
            rows: [{ label: 'Variance', value: '> 10%' }],
          },
          {
            id: 'signoff',
            kind: 'approval',
            app: 'Approval',
            title: 'Controller sign-off',
            badge: 'Human step',
            x: 624,
            y: 336,
            rows: [{ label: 'Reviewer', value: 'Jonas W. · Finance' }],
          },
        ],
        edges: [
          { from: 'trigger', to: 'pull' },
          { from: 'pull', to: 'variance' },
          { from: 'variance', to: 'signoff', label: 'over 10%' },
        ],
      },

      'policy-rollout': {
        nodes: [
          {
            id: 'trigger',
            kind: 'webhook',
            app: 'Webhook',
            title: 'Policy updated',
            badge: 'Trigger',
            x: 36,
            y: 150,
            rows: [
              { label: 'Event', value: 'policy.updated' },
              { label: 'Source', value: 'Notion' },
            ],
          },
          {
            id: 'filter',
            kind: 'filter',
            app: 'Filter',
            title: 'Department is Ops',
            badge: 'Filter',
            x: 360,
            y: 150,
            rows: [{ label: 'Department', value: 'Operations' }],
          },
          {
            id: 'publish',
            kind: 'notion',
            app: 'Notion',
            title: 'Update the handbook',
            badge: 'Action',
            x: 684,
            y: 150,
            rows: [{ label: 'Page', value: 'Ops handbook' }],
          },
        ],
        edges: [
          { from: 'trigger', to: 'filter' },
          { from: 'filter', to: 'publish', label: 'Operations' },
        ],
      },

      'vendor-onboarding': {
        nodes: [
          {
            id: 'trigger',
            kind: 'telegram',
            app: 'Telegram',
            title: 'Inbound vendor request',
            badge: 'Trigger',
            x: 36,
            y: 110,
            rows: [
              { label: 'Trigger on', value: 'Inline query' },
              { label: 'Scope', value: 'Any member' },
            ],
          },
          {
            id: 'form',
            kind: 'form',
            app: 'Form',
            title: 'Collect vendor details',
            badge: 'Action',
            x: 340,
            y: 110,
            rows: [
              { label: 'Fields', value: '6 required' },
              { label: 'Owner', value: 'Requester' },
            ],
          },
          {
            id: 'legal',
            kind: 'approval',
            app: 'Approval',
            title: 'Legal review',
            badge: 'Human step',
            x: 644,
            y: 110,
            rows: [{ label: 'Reviewer', value: 'Legal · queue' }],
          },
          {
            id: 'record',
            kind: 'airtable',
            app: 'Airtable',
            title: 'Create vendor record',
            badge: 'Action',
            x: 644,
            y: 336,
            rows: [{ label: 'Table', value: 'Vendors' }],
          },
        ],
        edges: [
          { from: 'trigger', to: 'form' },
          { from: 'form', to: 'legal' },
          { from: 'legal', to: 'record', label: 'approved' },
        ],
      },

      'weekly-digest': {
        nodes: [
          {
            id: 'trigger',
            kind: 'schedule',
            app: 'Schedule',
            title: 'Friday afternoon',
            badge: 'Trigger',
            x: 36,
            y: 130,
            rows: [
              { label: 'Runs on', value: 'Fridays' },
              { label: 'Time', value: '16:00' },
            ],
          },
          {
            id: 'gather',
            kind: 'rain',
            app: 'Rain',
            title: 'Gather the week’s runs',
            badge: 'Action',
            x: 360,
            y: 130,
            rows: [{ label: 'Range', value: 'Last 7 days' }],
          },
          {
            id: 'draft',
            kind: 'compose',
            app: 'Compose',
            title: 'Draft the digest',
            badge: 'Action',
            x: 684,
            y: 130,
            rows: [{ label: 'Template', value: 'Weekly digest' }],
          },
          {
            id: 'send',
            kind: 'slack',
            app: 'Slack',
            title: 'Send to the team',
            badge: 'Action',
            x: 684,
            y: 336,
            rows: [{ label: 'Channel', value: '#general' }],
          },
        ],
        edges: [
          { from: 'trigger', to: 'gather' },
          { from: 'gather', to: 'draft' },
          { from: 'draft', to: 'send' },
        ],
      },
    },
  };
})();
