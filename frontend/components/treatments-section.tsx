import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Brain, Bone } from "lucide-react"

const treatments = [
    {
        name: "Psychiatry",
        doctors: 57,
        time: "08:45 AM",
        icon: Brain,
        color: "bg-blue-100 text-blue-600",
    },
    {
        name: "Orthopedic",
        doctors: 85,
        time: "08:45 AM",
        icon: Bone,
        color: "bg-green-100 text-green-600",
    },
]

export function TreatmentsSection() {
    return (
        <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-card-foreground">Available Treatments</CardTitle>
                <Button variant="link" className="text-primary hover:text-primary/80 p-0">
                    View All →
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {treatments.map((treatment, index) => {
                    const Icon = treatment.icon
                    return (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${treatment.color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-card-foreground">{treatment.name}</p>
                                    <p className="text-sm text-muted-foreground">{treatment.doctors} Doctors</p>
                                </div>
                            </div>
                            <span className="text-sm text-muted-foreground">{treatment.time}</span>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
