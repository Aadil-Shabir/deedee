// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/ca
import Relationships from "@/app/components/ui/profile-forms/relationship-form";

// This is a Server Component by default since it doesn't have "use client" 
export default function RelationshipsPage() {
  return (
    <div className="space-y-6">
          {/* Render the client-side Relationships component within server-rendered page */}
          <Relationships />
    </div>
  );
}