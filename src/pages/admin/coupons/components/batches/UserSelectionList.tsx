import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface User {
  user_id: string;
  role: string;
  user: {
    id: string;
    full_name: string | null;
    email: string;
  };
}

interface UserSelectionListProps {
  users: User[];
  selectedUsers: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  isLoading: boolean;
}

export function UserSelectionList({
  users,
  selectedUsers,
  onSelectionChange,
  isLoading,
}: UserSelectionListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) => {
    const searchTerm = searchQuery.toLowerCase();
    const fullName = user.user.full_name?.toLowerCase() || "";
    const email = user.user.email.toLowerCase();
    return fullName.includes(searchTerm) || email.includes(searchTerm);
  });

  if (isLoading) {
    return <div>Loading eligible users...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="pl-8"
        />
      </div>
      <ScrollArea className="h-[300px] rounded-md border p-4">
        {filteredUsers.map((user) => (
          <div key={user.user_id} className="flex items-center space-x-2 py-2">
            <Checkbox
              id={user.user_id}
              checked={selectedUsers.includes(user.user_id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onSelectionChange([...selectedUsers, user.user_id]);
                } else {
                  onSelectionChange(
                    selectedUsers.filter((id) => id !== user.user_id)
                  );
                }
              }}
            />
            <Label htmlFor={user.user_id} className="flex-1">
              {user.user.full_name || user.user.email}
              <div className="text-sm text-gray-500">{user.role}</div>
            </Label>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="text-sm text-gray-500">
            No eligible users found or all users already have coupons from this batch
          </div>
        )}
      </ScrollArea>
    </div>
  );
}