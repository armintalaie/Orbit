import { Metadata } from "next"
import Image from "next/image"

// import { Separator } from "@/registry/new-york/ui/separator"
import { SidebarNav } from "../../components/settings/sidebar-nav"
import { Separator } from "@radix-ui/themes"

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
}

const sidebarNavItems = [
//   {
//     title: "Profile",
//     href: "/examples/forms",
//   },
//   {
//     title: "Account",
//     href: "/examples/forms/account",
//   },
//   {
//     title: "Appearance",
//     href: "/examples/forms/appearance",
//   },
//   {
//     title: "Notifications",
//     href: "/examples/forms/notifications",
//   },
//   {
//     title: "Display",
//     href: "/examples/forms/display",
//   },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
   
      <main className="h-screen w-screen  ">
      <div className="hidden  p-10  md:block w-full h-full pb-2">
        <div className=" w-full pt-2 pb-3">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            {/* Manage your account settings and set e-mail preferences. */}
          </p>
        </div>
        <Separator className=" w-full "  orientation="horizontal" size={'4'}/>

        <div className="pt-4 flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 h-full">
          {/* <aside className=" lg:w-1/5  border-gray-300 h-full ">
            <SidebarNav items={sidebarNavItems} />
          </aside> */}
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
        </main>
    </>
  )
}