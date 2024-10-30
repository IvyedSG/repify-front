'use client'

import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { toast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

interface Notification {
  id: number
  message: string
}

const fetcher = (url: string, token: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json())

export function NotificationButton() {
  const { data: session } = useSession()
  const [showAllNotifications, setShowAllNotifications] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)

  const { data: notifications, error, mutate } = useSWR<Notification[]>(
    session?.user?.accessToken
      ? ['http://127.0.0.1:8000/usuario/projects/GetNotifications/', session.user.accessToken]
      : null,
    ([url, token]) => fetcher(url, token),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onError: (err) => {
        console.error('Error fetching notifications:', err)
        toast({
          title: "Error",
          description: "Failed to load notifications. Please try again later.",
          variant: "destructive"
        })
      }
    }
  )

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      setHasUnread(true)
    }
  }, [notifications])

  const handleOpenDropdown = () => {
    setHasUnread(false)
  }

  const handleViewAll = () => {
    setShowAllNotifications(true)
    setHasUnread(false)
  }

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <Card className="mb-2 p-3 hover:bg-accent transition-colors">
      <p className="text-sm">{notification.message}</p>
    </Card>
  )

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative" onClick={handleOpenDropdown}>
            <Bell className="h-[1.2rem] w-[1.2rem]" />
            {hasUnread && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                <span className="sr-only">Notificaciones sin leer</span>
                <span aria-hidden="true">!</span>
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="p-2">
            <h3 className="font-semibold text-lg mb-2">Notificaciones</h3>
            {notifications && notifications.length > 0 ? (
              <>
                {notifications.slice(0, 3).map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
                {notifications.length > 3 && (
                  <Button variant="link" onClick={handleViewAll} className="w-full mt-2">
                    Ver las {notifications.length} notificaciones
                  </Button>
                )}
              </>
            ) : (
              <p className="text-muted-foreground text-center py-4">No hay nuevas notificaciones</p>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showAllNotifications} onOpenChange={setShowAllNotifications}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              Todas las notificaciones
              <Button variant="ghost" size="icon" onClick={() => setShowAllNotifications(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            {notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No hay notificaciones</p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}