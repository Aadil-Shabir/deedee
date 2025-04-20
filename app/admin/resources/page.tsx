"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Link, FileText, Video } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  type: "article" | "video" | "document" | "link";
  category: string;
  views: number;
  lastUpdated: string;
  status: "published" | "draft";
}

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [resources, setResources] = useState<Resource[]>([
    {
      id: "1",
      title: "Guide to Startup Funding",
      type: "article",
      category: "Fundraising",
      views: 1200,
      lastUpdated: "2024-03-15",
      status: "published",
    },
    {
      id: "2",
      title: "Market Research Basics",
      type: "video",
      category: "Marketing",
      views: 850,
      lastUpdated: "2024-03-10",
      status: "published",
    },
    {
      id: "3",
      title: "Business Model Canvas",
      type: "document",
      category: "Business Planning",
      views: 650,
      lastUpdated: "2024-03-05",
      status: "draft",
    },
  ]);

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getResourceIcon = (type: Resource["type"]) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "link":
        return <Link className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Resources</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Resource
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Resource Management</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">{resource.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getResourceIcon(resource.type)}
                      <span className="capitalize">{resource.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{resource.category}</TableCell>
                  <TableCell>{resource.views}</TableCell>
                  <TableCell>{resource.lastUpdated}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      resource.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {resource.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 