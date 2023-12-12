"use client";

import { DialogCloseButton } from "@/components/dialogClose";
import {NewIssue} from "@/components/newIssue";
import { CardHeader,  CardContent } from "@/components/ui/card";
import { dateFormater , isOverdue} from "@/lib/util";
import {  TableIcon, BoxIcon, CaretDownIcon, DotsVerticalIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Badge, Button, Heading, Box, Text,
    ContextMenu,Table
 } from "@radix-ui/themes";
 import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState} from "react";
import { FilterIcon } from "lucide-react";
import Link from "next/link";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"


export default function ProjectPage() {
    const params = useParams()
    const [tasks, setTasks] = useState([])
    const [project, setProject] = useState([])
    const viewTypes = ['board', 'table']
    const [viewType, setViewType] = useState(viewTypes[0])

    useEffect(() => {
        async function fetchTasks() {

            const res = await fetch(`/api/projects/${params.projectId}/issues`);
            const tasks = await res.json();
            setTasks(tasks);
        }
        async function fetchProject() {

            const res = await fetch(`/api/projects/${params.projectId}`);
            const project = await res.json();
            setProject(project);
        }
        fetchProject();
        // fetchTasks();
    }, [])



    return (
        <div className="flex flex-col min-h-screen w-full">
           
                <div className=" h-full flex-1 flex flex-col w-full ">
                    
                        <div className="flex items-center justify-between w-full p-4 px-4  h-12 ">
                            <div className="flex flex-row items-center gap-2">
                            <h1 className="text-md font-medium leading-tight text-gray-700 h-full pr-2">
                                {project.title}
                            </h1>
                           <ProjectOptions projectId={project.id}/>
                            </div>
                            <div className="flex items-center gap-2 justify-center h-full">
                            <NewIssue button={true}/>
                            
            
                            </div>
                        </div>
                    
                    <div className=" bg-gray-50 h-full flex-1 flex flex-col w-full ">
              
              <div className="flex flex-row items-center justify-between p-2 py-3 bg-white border-y border-gray-100">
             {/* <FilterGroup/> */}

              <ToggleGroupDemo viewType={viewType} setViewType={setViewType} />
             
              </div>
                        <div className=" h-full flex flex-col flex-grow">
                        {/* {viewType === 'table' ? <TableView tasks={tasks} /> : <KanbanView tasks={tasks} />} */}
                           
                        </div>
                    </div>
                    
                </div>
           

        </div>
    );

    
}

function TaskCard({ task }) {

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


function TableView({tasks}) {


   return(
    <div className="w-full h-full flex flex-col ">
     <Table.Root className="w-full  bg-white border-gray-200 overflow-hidden rounded-sm shadow-none" >

    <Table.Body>


        {tasks.map((taskType) => (
            // <Table.RowGroup key={taskType.status}>
            <>
                <Table.Row className="bg-gray-50  ">
                    <Table.Cell colSpan={5}>
                        <Heading size="3">{taskType.status}</Heading>
                    </Table.Cell>
                </Table.Row>
                {taskType.tasks.map((task) => (
                    <Table.Row key={task.id}>
                        <Table.RowHeaderCell>{task.name}</Table.RowHeaderCell>
                        <Table.Cell>Jake J</Table.Cell>
                        <Table.Cell>
                            {task.priority != 0 && (
                            <Badge color="gray">
                                {"!".repeat(task.priority)}
                            </Badge>
                            )}
                        </Table.Cell>
                        <Table.Cell>
                            {isOverdue(task.deadline) ? (
                                <Badge color="red">{dateFormater(task.deadline)}</Badge>
                            ) : (
                                <Badge color="gray"> {dateFormater(task.deadline)}</Badge>
                            )}
                        </Table.Cell>
                    </Table.Row>
                ))}
                <Table.Row className="bg-gray-50  ">
                    <Table.Cell colSpan={5}>
                        <NewIssue button={false}/>
                    </Table.Cell>
                </Table.Row>
                </>
                ))}

    </Table.Body>


    </Table.Root>
    </div>
    )

}


function KanbanView({tasks}) {

   return( <div className="flex flex-row h-full gap-8 flex-1 p-4 px-2">
    {tasks.map((task) => (
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




function ProjectOptions({projectId}: {projectId: string}) {
    const router = useRouter()

    async function deleteProject() {
        const res = await fetch(`/api/projects/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!res.ok) throw new Error(res.statusText)
        router.push('/projects')
    }
 
    async function archiveProject() {
        const res = await fetch(`/api/projects/${projectId}/archive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!res.ok) throw new Error(res.statusText)
        router.push('/projects')
    }

    return ( 
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Project Settings</DropdownMenuLabel>
          
          <DropdownMenuSub>
          <DropdownMenuSubTrigger>Archive project</DropdownMenuSubTrigger>
          </DropdownMenuSub>


          <DropdownMenuSeparator />

          <DropdownMenuGroup>
           
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
              <DropdownMenuSubTrigger>Members</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Email</DropdownMenuItem>
                  <DropdownMenuItem>Message</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>More...</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
           
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
         
          <DropdownMenuItem>
            <Button variant="ghost" onClick={() => deleteProject()}>
            Delete project
            </Button>
          
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }