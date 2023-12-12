"use client";

import {NewProject, newProject} from "@/components/newProject";
import { CardHeader,  CardContent } from "@/components/ui/card";
import { dateFormater , isOverdue} from "@/lib/util";
import {  TableIcon, BoxIcon, CaretDownIcon } from "@radix-ui/react-icons";
import { Badge, Button, Heading, Box, Text,
    ContextMenu,Table, DropdownMenu
 } from "@radix-ui/themes";
 import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useParams } from "next/navigation";
import { useEffect, useState} from "react";
import { FilterIcon } from "lucide-react";
import Link from "next/link";


export default function ProjectPage() {
    const params = useParams()
    const [projects, setProjects] = useState([])
    const viewTypes = ['board', 'table']
    const [viewType, setViewType] = useState(viewTypes[0])

    async function reload() {
        const res = await fetch(`/api/projects`);
        const project = await res.json();
        setProjects(project);
    }

    useEffect(() => {
        async function fetchProjects() {
            const res = await fetch(`/api/projects`);
            const project = await res.json();
            setProjects(project);
        }

        fetchProjects();
;
    }, [])



    return (
        <div className="flex flex-col min-h-screen w-full">
           
                <div className=" h-full flex-1 flex flex-col w-full ">
                    
                        <div className="flex items-center justify-between w-full p-4 px-4  h-12 ">
                            <h1 className="text-md font-medium leading-tight text-gray-700 h-full">
                               Projects
                            </h1>
                            <div className="flex items-center gap-2 justify-center h-full">
                    
                              <NewProject button={true} reload={reload}/>
                              
                             
                            </div>
                        </div>
                    
                    <div className=" bg-gray-50 h-full flex-1 flex flex-col w-full ">
              
              <div className="flex flex-row items-center justify-between p-2 py-3 bg-white border-y border-gray-100">
             <FilterGroup/>

              <ToggleGroupDemo viewType={viewType} setViewType={setViewType} />
             
              </div>
                        <div className=" h-full flex flex-col flex-grow">
                    <TableView projects={projects} />
                           
                        </div>
                    </div>
                    
                </div>
           

        </div>
    );

    
}

function TaskCard({ projects }) {

    return (
        <ContextMenu.Root >
  <ContextMenu.Trigger>
  <Link 
  href={`/projects/1/issues/${task.id}`} className={'pointer-events-none'} 
  aria-disabled={true}  >
        <Box   className="flex flex-col gap-2 p-2 bg-white shadow-sm rounded-sm  border border-gray-200 hover:shadow-md">
           
        <div className="flex flex-row gap-2 w-full justify-between py-0">
               <Text size="1" className="text-gray-600">#{task.id}</Text>
{task.priority != 0 && (
                <Badge color="gray">
                    {"!".repeat(task.priority)}
                </Badge>
                )}
            </div>
            <Text size="2" className="p-0 font-semibold  text-gray-700">{task.name}</Text>
            
            <div className="flex flex-row gap-2 w-full justify-between">
            <Text size="1" className="font-semibold text-gray-500 ">Jake j</Text>
            {isOverdue(task.deadline) ? (
                <Badge color="red">{dateFormater(task.deadline)}</Badge>
            ) : (
                <Badge color="gray"> {dateFormater(task.deadline)}</Badge>
            )}
        
            </div>
           
           
       </Box>
       </Link>
    {/* <RightClickZone style={{ height: 150 }} /> */}
  </ContextMenu.Trigger>
  <ContextMenu.Content size="2">
    {/* <ContextMenu.Item shortcut="⌘ E">Edit</ContextMenu.Item> */}
    <ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item shortcut="⌘ N">Archive</ContextMenu.Item>
    <ContextMenu.Item>Move to project…</ContextMenu.Item>

    <ContextMenu.Sub>
      <ContextMenu.SubTrigger>More</ContextMenu.SubTrigger>
      <ContextMenu.SubContent>
       
        <ContextMenu.Separator />
        <ContextMenu.Item>Advanced options…</ContextMenu.Item>
      </ContextMenu.SubContent>
    </ContextMenu.Sub>

    <ContextMenu.Separator />
    <ContextMenu.Item>Share</ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item shortcut="⌘ ⌫" color="red">
      Delete
    </ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>
      
    );
}


function TableView({projects}) {


   return(
    <div className="w-full h-full flex flex-col ">
     <Table.Root className="w-full  bg-white border-gray-200 overflow-hidden rounded-sm shadow-none" >

    <Table.Body>


        {projects.map((project) => (
            // <Table.RowGroup key={taskType.status}>
            // {
            //     "id": 1,
            //     "name": "Website Redesign",
            //     "description": "Complete overhaul of the company website for improved user experience and SEO.",
            //     "status": 1,
            //     "deadline": "2022-12-31T00:00:00.000Z",
            //     "meta": {
            //         "dateCreated": "2022-01-01T00:00:00.000Z",
            //         "dateUpdated": "2022-01-02T00:00:00.000Z"
            //     },
            //     "connections": [
            //         {
            //             "url": "https://github.com/company/website-redesign",
            //             "label": "GitHub Repository",
            //             "domain": "github.com"
            //         }
            //     ]
            // },
            
  
                    <Table.Row key={project.id}>
                        <Table.RowHeaderCell>
                            <Link href={`/projects/${project.id}`} shallow={true} className="underline"
                            >{project.title}
                            </Link>
                            </Table.RowHeaderCell>
                        <Table.Cell>
                            {project.description}
                        </Table.Cell>
                        <Table.Cell>
                            {project.status}
                        </Table.Cell>
                        <Table.Cell>
                        {isOverdue(project.deadline) ? (
                                <Badge color="red">{dateFormater(project.deadline)}</Badge>
                            ) : (
                                <Badge color="gray"> {dateFormater(project.deadline)}</Badge>
                            )}
                        </Table.Cell>
                        <Table.Cell>
                            {project.dateCreated}
                        </Table.Cell>
                        <Table.Cell>
                            {project.dateUpdated}
                            </Table.Cell>
                
                    </Table.Row>
       
           
                ))}

    </Table.Body>


    </Table.Root>
    </div>
    )

}


function KanbanView({projects}) {

   return( <div className="flex flex-row h-full gap-8 flex-1 p-4 px-2">
    {projects.map((projects) => (
        <div key={task.status}>
            <div className="h-full w-72 p-0 rounded-sm " >
                <CardHeader className="flex flex-row items-center justify-between px-1">
                    <Heading size="3">{task.status}</Heading>
                    <NewIssue button={false}/>
        
                 
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto p-0">
                    <ul className="space-y-3">
                        {task.tasks.map((task) => (
                            <li key={task.id}>
                                <TaskCard task={task} />
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </div>
        </div>
    ))}
</div>)

}

const ToggleGroupDemo = ({viewType, setViewType}) => {
    return (
        <ToggleGroup.Root
            className="w-fit flex flex-row   overflow-hidden  shadow-sm divide-x divide-gray-200 bg-white h-8  justify-between items-center rounded-sm border border-gray-200 text-xs text-left  text-gray-500"
            type="single"
            defaultValue="center"
            aria-label="Text alignment"
        >
            <ToggleGroup.Item 
                className={`w-9 flex items-center justify-center p-2 ${viewType === "table" ? "bg-gray-100" : "bg-inherit"}`} 
                value="table" 
                aria-label="Left aligned" 
                onClick={() => setViewType('table')}
            >
                <TableIcon />
            </ToggleGroup.Item>
            <ToggleGroup.Item 
                className={`w-9 flex items-center justify-center p-2 ${viewType === "board" ? "bg-gray-100" : "bg-inherit"}`} 
                value="board" 
                aria-label="Center aligned" 
                onClick={() => setViewType('board')}
            >
                <BoxIcon />
            </ToggleGroup.Item>
        </ToggleGroup.Root>
    );
}


function FilterGroup ( {filters, setFilters}) {

    return (
    <DropdownMenu.Root>
  <DropdownMenu.Trigger>
    <button className="bg-white flex h-8  justify-between items-center rounded-sm shadow-sm border border-gray-200 text-xs text-left p-1 px-4 text-gray-500">
        <FilterIcon className="h-3 w-3 mr-1" /> 
      Filter
      {/* <CaretDownIcon /> */}
    </button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>
    <DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
      <DropdownMenu.SubContent>
        <DropdownMenu.Item>Move to project…</DropdownMenu.Item>
        <DropdownMenu.Item>Move to folder…</DropdownMenu.Item>

        <DropdownMenu.Separator />
        <DropdownMenu.Item>Advanced options…</DropdownMenu.Item>
      </DropdownMenu.SubContent>
    </DropdownMenu.Sub>

    <DropdownMenu.Separator />
    <DropdownMenu.Item>Share</DropdownMenu.Item>
    <DropdownMenu.Item>Add to favorites</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item shortcut="⌘ ⌫" color="red">
      Delete
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
    );

}