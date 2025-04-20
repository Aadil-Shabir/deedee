"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Company configuration and preferences will be managed here</p>
        </CardContent>
      </Card>
    </div>
  );
} 