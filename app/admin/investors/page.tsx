"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Mail, Phone, Building2 } from "lucide-react";

interface Investor {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  investmentFocus: string[];
  status: "active" | "inactive";
  lastContact: string;
}

export default function InvestorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [investors, setInvestors] = useState<Investor[]>([
    {
      id: "1",
      name: "John Smith",
      company: "Venture Capital Partners",
      email: "john@vcpartners.com",
      phone: "+1 (555) 123-4567",
      investmentFocus: ["Tech", "AI", "Healthcare"],
      status: "active",
      lastContact: "2024-03-15",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      company: "Growth Fund",
      email: "sarah@growthfund.com",
      phone: "+1 (555) 987-6543",
      investmentFocus: ["Fintech", "E-commerce"],
      status: "active",
      lastContact: "2024-03-10",
    },
    {
      id: "3",
      name: "Michael Chen",
      company: "Angel Investors Network",
      email: "michael@angelnetwork.com",
      phone: "+1 (555) 456-7890",
      investmentFocus: ["Clean Tech", "Sustainability"],
      status: "inactive",
      lastContact: "2024-02-28",
    },
  ]);

  const filteredInvestors = investors.filter(investor =>
    investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.investmentFocus.some(focus => 
      focus.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Investors</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Investor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Investor Management</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search investors..."
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
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Investment Focus</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvestors.map((investor) => (
                <TableRow key={investor.id}>
                  <TableCell className="font-medium">{investor.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{investor.company}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{investor.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{investor.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {investor.investmentFocus.map((focus, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
                        >
                          {focus}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{investor.lastContact}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      investor.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {investor.status}
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