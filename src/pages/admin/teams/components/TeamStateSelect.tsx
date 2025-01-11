import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface TeamStateSelectProps {
  currentState: string;
  onStateChange: (newState: string) => void;
  disabled?: boolean;
}

export function TeamStateSelect({ currentState, onStateChange, disabled }: TeamStateSelectProps) {
  const states = [
    { value: 'draft', label: 'Draft' },
    { value: 'open', label: 'Open' },
    { value: 'locked', label: 'Locked' },
    { value: 'active', label: 'Active' },
    { value: 'pending_mentor', label: 'Pending Mentor' }
  ];

  const getStateColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'locked':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending_mentor':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Select value={currentState} onValueChange={onStateChange} disabled={disabled}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>
          <Badge className={getStateColor(currentState)}>
            {currentState.replace('_', ' ').toUpperCase()}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {states.map((state) => (
          <SelectItem key={state.value} value={state.value}>
            <Badge className={getStateColor(state.value)}>
              {state.label.toUpperCase()}
            </Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}