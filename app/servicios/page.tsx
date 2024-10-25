import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function PoliticaDePrivacidad() {
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
              <Link href="/register">Registrarse</Link>
            </Button>
            
          </nav>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 pt-16 overflow-y-auto">
        <div className="container px-4 py-10 mx-auto md:px-8 lg:px-12">
          <article className="max-w-3xl mx-auto space-y-8">
            <h1 className="mb-8 text-4xl font-bold text-gray-100">Política de Privacidad</h1>

            {[
              { title: "1. Información que Recopilamos", content: "Recopilamos varios tipos de información, incluidos datos personales que usted proporciona al registrarse, como nombre, dirección de correo electrónico, y otros datos necesarios para ofrecer nuestros servicios." },
              { title: "2. Uso de la Información", content: "Utilizamos su información para personalizar su experiencia en nuestra plataforma, mejorar nuestros servicios, y comunicarnos con usted para asuntos relacionados con su cuenta." },
              { title: "3. Compartir Información", content: "No compartimos su información personal con terceros, excepto en los casos en que sea necesario para cumplir con la ley o para proporcionarle los servicios solicitados." },
              { title: "4. Seguridad de los Datos", content: "Tomamos medidas razonables para proteger su información personal. Sin embargo, no podemos garantizar la seguridad completa de los datos transmitidos por internet." },
              { title: "5. Sus Derechos", content: "Usted tiene derecho a acceder, modificar o eliminar su información personal en cualquier momento. Puede ponerse en contacto con nosotros para ejercer estos derechos." },
              { title: "6. Cookies", content: "Utilizamos cookies para mejorar su experiencia en nuestra plataforma. Puede configurar su navegador para rechazar las cookies, pero esto puede afectar la funcionalidad del sitio web." },
              { title: "7. Cambios en la Política de Privacidad", content: "Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Los cambios se publicarán en esta página, por lo que recomendamos revisarla periódicamente." },
              { title: "8. Contacto", content: "Si tiene alguna pregunta o inquietud acerca de esta Política de Privacidad, puede contactarnos a través del correo electrónico proporcionado en el sitio web." },
            ].map((section, index) => (
              <section key={index} className="p-6 transition-shadow duration-300 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl">
                <h2 className="mb-4 text-2xl font-semibold text-gray-100">{section.title}</h2>
                <p className="mb-4 leading-relaxed text-gray-300">{section.content}</p>
              </section>
            ))}
          </article>
        </div>
      </main>
    </div>
  );
}

