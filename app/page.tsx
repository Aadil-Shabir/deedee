"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Code, Laptop, Palette } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Build beautiful web applications
            <span className="text-primary"> faster</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
            A production-ready template featuring Next.js 13, Tailwind CSS, and
            shadcn/ui for building modern web applications.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Documentation
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <Tabs defaultValue="design" className="max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>
          <TabsContent value="design" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <Palette className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Beautiful UI Components</CardTitle>
                  <CardDescription>
                    Pre-built components that you can copy and paste into your apps.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  Includes buttons, cards, navigation, modals, and more. All styled
                  with Tailwind CSS.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Code className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Style with Ease</CardTitle>
                  <CardDescription>
                    Built on top of Tailwind CSS with CSS variables for theming.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  Customize colors, border radius, and more with CSS variables.
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="development" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <Laptop className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Modern Development</CardTitle>
                  <CardDescription>
                    Built with Next.js 13 and TypeScript for type-safe code.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  Includes React Server Components, routing, layouts, loading UI,
                  and more.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Code className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Developer Experience</CardTitle>
                  <CardDescription>
                    Great developer experience with ESLint and TypeScript.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  Format on save, type checking, and more out of the box.
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="deployment" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Ready for Production</CardTitle>
                <CardDescription>
                  Deploy your application to any static hosting platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                Built for static exports with optimized production builds.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}