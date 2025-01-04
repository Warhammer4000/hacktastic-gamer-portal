import { MentorPreferences } from "@/components/mentor/profile/preferences/MentorPreferences";

export default function Preferences() {
  return (
    <div className="container max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Mentor Preferences</h1>
      <MentorPreferences />
    </div>
  );
}