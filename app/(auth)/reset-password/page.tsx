"use client"

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast, Toaster } from 'react-hot-toast'

export default function ResetPasswordPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('https://repo-s7h0.onrender.com/usuario/login/request-password-reset/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      if (response.ok) {
        toast.success('Código de verificación enviado')
        setStep(2)
      } else {
        throw new Error('Error al enviar el código')
      }
    } catch (error) {
      toast.error('Error al enviar el código de verificación')
    } finally {
      setIsLoading(false)
    }
  }, [email])

  const handleCodeSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('https://repo-s7h0.onrender.com/usuario/login/reset_password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          reset_code: parseInt(code.join("")),
          new_password: newPassword,
        }),
      })
      if (response.ok) {
        toast.success('Contraseña restablecida con éxito')
        // Redirect to login page after successful password reset
        setTimeout(() => window.location.href = '/', 2000)
      } else {
        throw new Error('Error al restablecer la contraseña')
      }
    } catch (error) {
      toast.error('Error al restablecer la contraseña')
    } finally {
      setIsLoading(false)
    }
  }, [email, code, newPassword])

  const handleCodeChange = useCallback((index: number, value: string) => {
    setCode(prevCode => {
      const newCode = [...prevCode]
      newCode[index] = value
      return newCode
    })

    // Move to next input if value is entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement
      if (nextInput) nextInput.focus()
    }
  }, [])

  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      <Toaster position="top-center" reverseOrder={false} />
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
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar Código'}
          </Button>
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
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nueva Contraseña</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
          </Button>
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