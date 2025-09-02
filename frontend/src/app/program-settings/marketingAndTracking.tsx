import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function MarketingAndTracking() {
    return (<div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Marketing and Tracking</CardTitle>
                <CardDescription>Set up tracking pixels and marketing integrations</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Marketing and tracking settings will be configured here.</p>
            </CardContent>
        </Card>
    </div>)
}