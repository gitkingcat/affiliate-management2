import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function PartnerGroups() {

    return (<div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Partner Groups</CardTitle>
                <CardDescription>Organize partners into groups with different commission structures</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Partner groups will be managed here.</p>
            </CardContent>
        </Card>
    </div>)
}