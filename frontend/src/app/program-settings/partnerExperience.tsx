import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function PartnerExperience() {
    return (<div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Partner Portal Settings</CardTitle>
                    <CardDescription>Configure the partner experience and portal settings</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Partner experience settings will be configured here.</p>
                </CardContent>
            </Card>
        </div>)
}