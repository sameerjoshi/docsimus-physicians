import { Button } from "@/src/components/ui";
import { Stethoscope } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <main className="flex flex-col items-center gap-8 text-center p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full primary-gradient">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold">
            <span className="gradient-text">Docsimus</span> Physicians
          </h1>
        </div>

        <p className="text-muted-foreground max-w-md">
          Design system foundation ready. Start building the physician portal screens.
        </p>

        <div className="flex gap-4">
          <Button variant="default">Primary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="gradient">Gradient Button</Button>
        </div>
      </main>
    </div>
  );
}
