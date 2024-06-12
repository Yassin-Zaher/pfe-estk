import { OrganizationProfile } from "@clerk/nextjs";
import { Plus } from "lucide-react";

import { Buttons } from "@/components/ui/buttons";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const InviteButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Buttons variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Invite members
        </Buttons>
      </DialogTrigger>

      <DialogContent className="p-0 bg-transparent border-none max-w-[880px] max-h-[400px]">
        <OrganizationProfile routing="hash" />
      </DialogContent>
    </Dialog>
  );
};
