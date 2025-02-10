import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserDto } from "@/types/user"
import { format } from "date-fns"

interface HostDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  host: UserDto
}

export function HostDetailsModal({ isOpen, onClose, host }: HostDetailsModalProps) {
  // Format join date if it exists, otherwise use a default message
  const joinDate = host?.createdAt 
    ? format(new Date(host.createdAt), 'MMMM yyyy')
    : 'Join date not available';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Host Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${host?.username}`}
              alt={host?.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{host?.name}</h3>
              <p className="text-sm text-gray-500">Joined in {joinDate}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p><span className="font-medium">Username:</span> {host?.username}</p>
            <p><span className="font-medium">Email:</span> {host?.email}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 