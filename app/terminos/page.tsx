import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function TerminosDeUso() {
  return (
    <div className="flex flex-col h-screen text-gray-200 bg-gray-950">
      {/* Header - Fijo en la parte superior */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-800 shadow-md bg-gray-950/95 backdrop-blur-lg">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <Link className="flex items-center space-x-2" href="/">
            <Image src="/logo.webp" alt="Repify Logo" width={32} height={32} />
            <span className="text-xl font-bold text-gray-100">Repify</span>
          </Link>
          <nav className="flex space-x-4">
            <Button variant="ghost" className="text-gray-200 transition-colors hover:bg-gray-800 hover:text-white" asChild>
              <Link href="/register">Regresar</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 pt-16 overflow-y-auto">
        <div className="container max-w-5xl px-4 py-10 mx-auto md:px-8 lg:px-12">
          <article className="space-y-8">
            <h1 className="mb-8 text-4xl font-bold text-gray-100">Términos de Uso</h1>

            {[
              { title: "1. Aceptación de los Términos", content: "Al acceder y utilizar este sitio web, usted acepta estar sujeto a estos Términos de Uso, todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables." },
              { title: "2. Uso de la Licencia", content: "Se concede permiso para descargar temporalmente una copia de los materiales (información o software) en el sitio web de la Empresa únicamente para visualización transitoria personal y no comercial.", list: ["Modificar o copiar los materiales;", "Usar los materiales para cualquier propósito comercial;", "Intentar descompilar o realizar ingeniería inversa de cualquier software;", "Eliminar cualquier copyright u otras anotaciones de propiedad;", "Transferir los materiales a otra persona o \"reflejar\" los materiales en cualquier otro servidor."] },
              { title: "3. Exención de responsabilidad", content: "Los materiales en el sitio web de la Empresa se proporcionan \"tal cual\". La Empresa no ofrece garantías, expresas o implícitas, y renuncia a todas las demás garantías, incluyendo implícitas de comerciabilidad o idoneidad." },
              { title: "4. Limitaciones", content: "En ningún caso la Empresa o sus proveedores serán responsables por daños que surjan del uso o la imposibilidad de usar los materiales." },
              { title: "5. Revisiones y Erratas", content: "Los materiales que aparecen en el sitio web podrían incluir errores técnicos, tipográficos o fotográficos. La Empresa no garantiza la precisión de los materiales." },
              { title: "6. Enlaces", content: "La Empresa no es responsable del contenido de sitios enlazados. El uso de cualquier sitio enlazado es por cuenta y riesgo del usuario." },
              { title: "7. Modificaciones a los Términos de Uso", content: "La Empresa puede revisar estos Términos de Uso en cualquier momento sin previo aviso." },
              { title: "8. Ley Aplicable", content: "Estos términos se rigen por las leyes del país de la Empresa, y usted se somete a la jurisdicción exclusiva de sus tribunales." },
            ].map((section, index) => (
              <div key={index} className="mb-6">
                <h2 className="mb-2 text-2xl font-semibold text-gray-100">{section.title}</h2>
                <p className="leading-relaxed text-gray-300">{section.content}</p>
                {section.list && (
                  <ul className="ml-6 space-y-2 text-gray-300 list-disc">
                    {section.list.map((item, i) => (
                      <li key={i} className="text-gray-400">{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </article>
        </div>
      </main>
    </div>
  );
}
