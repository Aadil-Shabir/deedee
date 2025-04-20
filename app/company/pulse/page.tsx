"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PulsePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Pulse</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Company metrics and performance indicators will be shown here</p>
        </CardContent>
      </Card>
    </div>
  );
} 