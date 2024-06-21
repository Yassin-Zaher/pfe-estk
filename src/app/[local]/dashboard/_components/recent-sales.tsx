import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentSales({ sales }) {
  return (
    <div className="space-y-8">
      {sales.map((sale, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>{sale.email[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm text-muted-foreground">{sale.email}</p>
          </div>
          <div className="ml-auto font-medium">+${sale.total.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
}
