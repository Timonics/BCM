import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const Settings: React.FC = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your settings here</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Content for settings will be displayed here.
        </p>
      </CardContent>
    </Card>
  );
};

export default Settings;
