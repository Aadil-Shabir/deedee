"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Video, 
  ExternalLink, 
  CheckCircle, 
  Flame,
  TrendingUp,
  Users,
  Mail,
  MessageSquare,
  Calendar,
  FileText,
  ArrowRight
} from "lucide-react";

const tasks = [
  {
    title: "Welcome to DeeDee",
    description: "Watch this quick intro to get started",
    type: "video",
    completed: false,
  },
  {
    title: "Set-up your DeeDee Profile",
    type: "video",
    completed: true,
  },
  {
    title: "Import your investors",
    type: "video",
    completed: true,
  },
  {
    title: "GetFundedFormula Checklist",
    type: "task",
    completed: true,
  },
  {
    title: "Send out your 1st Investment Update",
    type: "video",
    completed: true,
  },
];

export default function BasecampPage() {
  return (
    <div className="space-y-8 text-zinc-100">
      {/* Getting Started Section */}
      <section>
        <h3 className="text-2xl font-semibold mb-6 gradient-text">Getting Started</h3>
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <Card 
              key={index} 
              className="card-hover border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: "slideIn 0.5s ease-out forwards",
              }}
            >
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  {task.type === "video" ? (
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center animate-float">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center animate-float">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-zinc-100">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-zinc-400">{task.description}</p>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hover-glow text-zinc-100 hover:text-primary hover:bg-primary/20"
                >
                  Visit page
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Hottest Investors */}
        <Card className="card-hover border-border/50 bg-card/30 backdrop-blur-sm md:col-span-2 hover:bg-card/50 transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg text-zinc-100">Hottest Investors</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "John Smith",
                  company: "Tech Ventures",
                  location: "San Francisco, CA",
                  visits: 15
                },
                {
                  name: "Sarah Johnson",
                  company: "Angel Group",
                  location: "New York, NY",
                  visits: 12
                },
                {
                  name: "Mike Chen",
                  company: "Growth Capital",
                  location: "Boston, MA",
                  visits: 10
                }
              ].map((investor, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-zinc-100">
                      {investor.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-zinc-100">{investor.name}</h4>
                      <div className="text-sm text-zinc-400">
                        <p>{investor.company}</p>
                        <p>{investor.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-primary">{investor.visits} visits</span>
                    <Button variant="outline" size="sm" className="hover-glow text-zinc-100 hover:text-primary hover:bg-primary/20">
                      Connect
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="card-hover border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-zinc-100">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/20">
              See all
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium text-zinc-100">Investment Update Due</h4>
                  <p className="text-sm text-zinc-400">Your monthly update is due in 5 days</p>
                  <p className="text-xs text-zinc-500 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <MessageSquare className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium text-zinc-100">Message from Sarah Johnson</h4>
                  <p className="text-sm text-zinc-400">Thanks for the detailed presentation...</p>
                  <p className="text-xs text-zinc-500 mt-1">5 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Funding Progress */}
        <Card className="card-hover border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-100">Funding Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-primary">$1,055K raised</span>
                <span className="text-zinc-400">$100K goal</span>
              </div>
              <Progress value={100} className="bg-primary/20 h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-primary">$263.75K soft commitments</span>
                <span className="text-zinc-400">$100K goal</span>
              </div>
              <Progress value={100} className="bg-primary/20 h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Investors */}
        <Card className="card-hover border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-100">Investors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-zinc-100">42</span>
                <span className="text-sm text-zinc-400">on file</span>
              </div>
              <Button variant="outline" size="sm" className="hover-glow text-zinc-100 hover:text-primary hover:bg-primary/20">
                Add 110 more
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity Score */}
        <Card className="card-hover border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-100">Activity Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold text-zinc-100">85%</span>
                <span className="text-sm text-green-500">Bunny Mode 🐰</span>
              </div>
            </div>
            <p className="text-sm text-zinc-400 mt-2">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      {/* Health Score */}
      <Card className="card-hover border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-bold text-red-500">17<span className="text-lg text-zinc-400">/100</span></div>
            <Button variant="outline" size="sm" className="hover-glow text-zinc-100 hover:text-primary hover:bg-primary/20">
              Improve
            </Button>
          </div>
          <Progress value={17} className="bg-primary/20 h-2" />
        </CardContent>
      </Card>

      {/* Bottom Sections Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Tasks */}
        <Card className="card-hover border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-100">Upcoming</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {[
                {
                  title: "Tech Ventures",
                  time: "Tomorrow, 2:00 PM",
                  icon: Calendar,
                },
                {
                  title: "Growth Capital",
                  time: "Feb 28, 11:00 AM",
                  icon: Calendar,
                },
                {
                  title: "Send Investment Update",
                  time: "Due in 3 days",
                  icon: FileText,
                  action: "Complete"
                },
                {
                  title: "Update Metric Board",
                  time: "Due next week",
                  icon: FileText,
                  action: "Complete"
                }
              ].map((task, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      {task.icon && <task.icon className="h-4 w-4 text-primary" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-zinc-100">{task.title}</h4>
                      <p className="text-sm text-zinc-400">{task.time}</p>
                    </div>
                  </div>
                  {task.action && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="hover-glow text-zinc-100 hover:text-primary hover:bg-primary/20"
                    >
                      {task.action}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Refer a Founder */}
        <Card className="card-hover border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-100">Refer a Founder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <p className="text-zinc-400">Help other founders get funded</p>
              <Button 
                className="self-start hover-glow bg-primary/80 hover:bg-primary text-zinc-100 flex items-center gap-2"
              >
                Refer Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 