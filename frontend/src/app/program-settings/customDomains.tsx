import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function CustomDomains() {

    return (<div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Custom Domains</CardTitle>
                <CardDescription>Configure custom domains for your partner portal</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Custom domain settings will be configured here.</p>
            </CardContent>
        </Card>
    </div>)
}