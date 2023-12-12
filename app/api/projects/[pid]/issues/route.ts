import { NextApiRequest, NextApiResponse } from 'next';

let issues = [
  {
    id: '1',
    status: 'not-started',
    tasks: [
      {
        id: '1',
        name: 'Task 1',
        description: 'Task description 1',
        assignee: '1',
        deadline: '2023-01-01',
        completionRate: 0.0,
        priority: 3,
      },
      {
        id: '2',
        name: 'Task 2',
        description: 'Task description 2',
        assignee: '2',
        deadline: '2023-02-01',
        completionRate: 0.0,
        priority: 2,
      },
      {
        id: '3',
        name: 'Task 3',
        description: 'Task description 3',
        assignee: '3',
        deadline: '2023-03-01',
        completionRate: 0.0,
        priority: 1,
      },
    ],
  },

  {
    id: '2',
    status: 'in-progress',
    tasks: [
      {
        id: '4',
        name: 'Task 4',
        description: 'Task description 4',
        assignee: '4',
        deadline: '2023-04-01',
        completionRate: 0.5,
        priority: 3,
      },
      {
        id: '5',
        name: 'Task 5',
        description: 'Task description 5',
        assignee: '5',
        deadline: '2024-05-01',
        completionRate: 0.5,
        priority: 0,
      },
      {
        id: '6',
        name: 'Task 6',
        description: 'Task description 6',
        assignee: '6',
        deadline: '2024-06-01',
        completionRate: 0.5,
        priority: 1,
      },
    ],
  },

  {
    id: '3',
    status: 'completed',
    tasks: [
      {
        id: '7',
        name: 'Task 7',
        description: 'Task description 7',
        assignee: '7',
        deadline: '2023-12-11',
        completionRate: 1.0,
        priority: 2,
      },
      {
        id: '8',
        name: 'Task 8',
        description: 'Task description 8',
        assignee: '8',
        deadline: '2023-12-22',
        completionRate: 1.0,
        priority: 1,
      },
      {
        id: '9',
        name: 'Task 9',
        description: 'Task description 9',
        assignee: '9',
        deadline: '2023-12-15',
        completionRate: 1.0,
        priority: 2,
      },
    ],
  },
];

export async function GET(req: NextApiRequest, res: NextApiResponse<Response>) {
  return Response.json(issues);
}

export async function POST(req: Request, res: NextApiResponse<Response>) {
  const body = await req.json();
  console.log('body', body);
  for (const issue of issues) {
    console.log(issue.id);
    console.log(body.status);
    if (issue.id === body.status) {
      console.log('sslkd');
      issue.tasks.push(body);
      break;
    }
  }

  console.log(issues);

  return Response.json({ message: 'Issue created' });
}
