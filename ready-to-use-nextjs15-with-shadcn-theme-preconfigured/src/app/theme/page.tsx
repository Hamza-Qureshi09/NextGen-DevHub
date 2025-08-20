import { ThemeToggle } from "@/components/shared/theme/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Theme",
};

export default function Theme() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold font-Poppins text-foreground mb-2">
              Next.js 15 Theme Demo
            </h1>
            <p className="text-lg text-muted-foreground font-Lato">
              A minimal setup with shadcn/ui and Redux theme management
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-Merriweather">
                Typography Showcase
              </CardTitle>
              <CardDescription className="font-Lato">
                Different font families in action
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Badge variant="secondary" className="mb-2">
                  Figtree (Default Sans)
                </Badge>
                <p className="font-sans">
                  This is the default sans-serif font using Figtree.
                </p>
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">
                  Merriweather (Serif)
                </Badge>
                <p className="font-serif">
                  This is the serif font using Merriweather.
                </p>
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">
                  Poppins
                </Badge>
                <p className="font-Poppins">
                  This text uses the Poppins font family.
                </p>
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">
                  Nunito
                </Badge>
                <p className="font-Nunito">
                  This text uses the Nunito font family.
                </p>
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">
                  Lato
                </Badge>
                <p className="font-Lato">
                  This text uses the Lato font family.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-Poppins">Theme Colors</CardTitle>
              <CardDescription className="font-Lato">
                shadcn/ui color system in action
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">Primary Button</Button>
              <Button variant="secondary" className="w-full">
                Secondary Button
              </Button>
              <Button variant="outline" className="w-full">
                Outline Button
              </Button>
              <Button variant="ghost" className="w-full">
                Ghost Button
              </Button>
              <Button variant="destructive" className="w-full">
                Destructive Button
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-Merriweather">
                Theme Features
              </CardTitle>
              <CardDescription className="font-Lato">
                Redux-powered theme switching
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold font-Nunito mb-2">Features:</h4>
                <ul className="space-y-1 text-sm font-Lato">
                  <li>• Redux Toolkit state management</li>
                  <li>• System preference detection</li>
                  <li>• Persistent theme storage</li>
                  <li>• shadcn/ui integration</li>
                  <li>• Custom font configuration</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Badge>Dark Mode</Badge>
                <Badge variant="outline">Light Mode</Badge>
                <Badge variant="secondary">System</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-Poppins">
              Color Palette Preview
            </CardTitle>
            <CardDescription className="font-Lato">
              Current theme colors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <div className="space-y-2">
                <div className="w-full h-12 bg-background border rounded"></div>
                <p className="text-xs font-Lato">Background</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 bg-foreground rounded"></div>
                <p className="text-xs font-Lato">Foreground</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 bg-primary rounded"></div>
                <p className="text-xs font-Lato">Primary</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 bg-secondary rounded"></div>
                <p className="text-xs font-Lato">Secondary</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 bg-muted rounded"></div>
                <p className="text-xs font-Lato">Muted</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 bg-accent rounded"></div>
                <p className="text-xs font-Lato">Accent</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 bg-destructive rounded"></div>
                <p className="text-xs font-Lato">Destructive</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 bg-border border rounded"></div>
                <p className="text-xs font-Lato">Border</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
