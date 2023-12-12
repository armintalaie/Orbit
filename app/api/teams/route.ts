import { NextApiRequest, NextApiResponse } from 'next';

interface ITeam {
  id: number;
  name: string;
  description: string;
  status: number;
  meta: IMeta;
  members: number[];
  projects: number[];
}

interface IMeta {
  dateCreated: Date;
  dateUpdated: Date;
}

export let teams: ITeam[] = [
  {
    id: 1,
    name: 'Web Development Team',
    description:
      'Responsible for developing and maintaining the company website.',
    status: 1,
    meta: {
      dateCreated: new Date('2022-01-01'),
      dateUpdated: new Date('2022-01-02'),
    },
    members: [1, 2, 3],
    projects: [1, 2],
  },
  {
    id: 2,
    name: 'Mobile App Team',
    description:
      'Responsible for developing and maintaining the company mobile app.',
    status: 2,
    meta: {
      dateCreated: new Date('2022-02-01'),
      dateUpdated: new Date('2022-02-02'),
    },
    members: [4, 5, 6],
    projects: [3, 4],
  },
  {
    id: 3,
    name: 'API Team',
    description: 'Responsible for developing and maintaining the company API.',
    status: 3,
    meta: {
      dateCreated: new Date('2022-03-01'),
      dateUpdated: new Date('2022-03-02'),
    },
    members: [7, 8, 9],
    projects: [5, 6],
  },
];

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  return Response.json(teams);
}

export async function POST(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const newTeam = req.body;
  teams.push(newTeam);
  return Response.json(newTeam);
}
