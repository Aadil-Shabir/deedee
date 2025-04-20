"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LearningPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Learning Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Educational content and learning materials will be available here</p>
        </CardContent>
      </Card>
    </div>
  );
} 