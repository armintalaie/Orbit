import Link from "next/link";
import { getAllBlogPostMetadata } from "./utils";



export default function Layout({ children }) {
    const {posts, directories} = getAllBlogPostMetadata();
    
   return (
    <div className="bg-neutral-950 h-screen max-h-screen text-white flex flex-col dark overflow-hidden">

        <nav className=" p-2 px-4 text-center border-b flex items-center justify-between w-full">
            <div className="flex justify-between w-full items-center ">
            <h2>
                Orbit Docs
            </h2>
            <div className="flex items-center gap-4">
                <Link
                href="/"
                className="text-white bg-gradient-to-r rounded-lg from-teal-900 to-teal-800 text-sm w-24 p-0.5 h-full"
                >
                    <p className="p-2 bg-neutral-950 rounded-md w-full"
                    >Orbit</p>
                
                </Link>
            <input type="text" placeholder="Search" className="bg-neutral-900 text-white p-2 rounded-lg" />

            </div>
           
            </div>
        
        </nav>
        <section className="flex-1 p-4 flex overflow-y-hidden">
        <aside className="w-72 h-screen overflow-y-scroll text-white text-sm">
            <SideBarNav posts={posts} directories={directories} />
        </aside>
        <div className="flex-1 flex justify-center overflow-y-hidden h-full ">
        {children}
        </div>
        </section>
    </div>

    );
}

function SideBarNav({posts, directories}) {
    return (
        <>
             {posts.map((post) => {
                return (
                    <div>
                        <a  className="line-clamp-1 p-1 pr-0 block hover:text-blue-500 truncate"
                        href={`/docs/${post.slug}`}>{post.metadata.title}</a>

                    </div>
                );
            })}
            {directories.map((directory) => {
                return (
                    <div className="p-2 pr-0">
                        <h4 className="text-md font-semibold border-b p-1 pr-0">{directory.metadata.title}</h4>
                        <ul className="p-1 pr-0 text-sm">
                            {directory.posts.map((post) => {
                                return (
                                    <li className="line-clamp-1  p-1 block hover:text-blue-500 truncate">
                                        <a href={`/docs/${post.slug}`}>{post.metadata.title}</a>
                                    </li>
                                );
                            })}
                            
                        </ul>
                        <SideBarNav posts={[]} directories={directory.directories} />
                    </div>
                );
            }
            )}
           
           </>
      
    );
}

