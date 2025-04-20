"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FilesPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Files</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Document management and file storage will be available here</p>
        </CardContent>
      </Card>
    </div>
  );
} 