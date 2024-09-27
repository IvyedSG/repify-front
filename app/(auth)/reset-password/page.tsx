"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [code, setCode] = useState(["", "", "", "", "", ""])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send a request to your backend to send the reset code
    setStep(2)
  }

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically verify the code with your backend
    console.log("Submitted code:", code.join(""))
  }

  const handleCodeChange = (index: number, value: string) => {
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Move to next input if value is entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement
      if (nextInput) nextInput.focus()
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Restablecer Contraseña
        </h1>
        <p className="text-sm text-muted-foreground">
          {step === 1 ? "Ingresa tu correo electrónico para recibir un código" : "Ingresa el código de 6 dígitos que recibiste"}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="tu@ejemplo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <Button type="submit" className="w-full">Enviar Código</Button>
        </form>
      ) : (
        <form onSubmit={handleCodeSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code-0">Código de Verificación</Label>
            <div className="flex justify-between">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  className="w-12 text-center"
                  required
                />
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full">Verificar Código</Button>
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/"
          className="underline underline-offset-4 hover:text-primary"
        >
          Volver al inicio de sesión
        </Link>
      </p>
    </div>
  )
}