import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  const email: string = session?.user?.email ?? "";
  
  // CORRECCIÓN: Usar la URL interna si existe (Docker), sino localhost (Local)
  const apiUrl = process.env.INTERNAL_API_URL || "http://localhost:3001";
  
  try {
    const res = await fetch(`${apiUrl}/api/users/email/${email}`, { 
      cache: 'no-store' // Importante para evitar datos viejos
    });
    
    if (!res.ok) {
       console.error("Error fetching user role:", res.status);
       // Opcional: manejar el error suavemente
       return <>{children}</>; 
    }

    const data = await res.json();
    
    // redirecting user to the home page if not admin
    if (data.role === "user") {
      redirect("/");
    }
  } catch (error) {
    console.error("Network error in layout:", error);
    // En caso de error de red, podrías redirigir o mostrar error
  }

  return <>{children}</>;
}