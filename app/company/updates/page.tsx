"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UpdatesPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Latest company updates and announcements will be shown here</p>
        </CardContent>
      </Card>
    </div>
  );
} 