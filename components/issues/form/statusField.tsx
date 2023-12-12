"use client"
 
import * as React from "react"
import {
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  HelpCircle,
  LucideIcon,
  XCircle,
} from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
 
type Status = {
  value: number
  label: string
  icon: LucideIcon
}
 
const statuses: Status[] = [
  {
    value: 1,
    label: "Backlog",
    icon: HelpCircle,
  },
  {
    value: 2,
    label: "Todo",
    icon: Circle,
  },
  {
    value: 3,
    label: "In Progress",
    icon: ArrowUpCircle,
  },
  {
    value: 4,
    label: "Done",
    icon: CheckCircle2,
  },
  {
    value: 5,
    label: "Canceled",
    icon: XCircle,
  },
]
 
export function StatusField(field: any) {
  const [open, setOpen] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState<Status | undefined>(
    statuses.find((status) => status.value === field.value)
  )
 
  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-[150px] justify-start"
          >
            {selectedStatus ? (
              <>
                <selectedStatus.icon className="mr-2 h-4 w-4 shrink-0" />
                {selectedStatus.label}
              </>
            ) : (
              <>+ Set status</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command >
            <CommandInput placeholder="Change status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value.toString()}
                    onSelect={(value) => {
                      setSelectedStatus(
                        statuses.find((priority) => priority.value.toString() === value.toString()) ||
                          null
                      )
                      field.onChange(Number(value))
                      setOpen(false)
                    }}
                  >
                    <status.icon
                      className={cn(
                        "mr-2 h-4 w-4",
                        status.value === selectedStatus?.value
                          ? "opacity-100"
                          : "opacity-40"
                      )}
                    />
                    <span>{status.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}