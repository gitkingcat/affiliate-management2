import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, MoreHorizontal } from "lucide-react"

interface Flow {
    id: number
    name: string
    description: string
    dateCreated: string
    isDefault: boolean
    isActive: boolean
    type: "standard" | "yearly" | "premium"
}

interface FlowCardProps {
    flow: Flow
    isActive: boolean
    onToggle: (flowId: number) => void
}

export default function FlowCard({ flow, isActive, onToggle }: FlowCardProps) {
    return (
        <Card key={flow.id} className="transition-all hover:shadow-sm">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-lg">{flow.name}</h3>
                            {flow.isDefault && (
                                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                    Default
                                </Badge>
                            )}
                        </div>

                        <p className="text-muted-foreground mb-3">
                            {flow.description}
                        </p>

                        <p className="text-sm text-muted-foreground">
                            Default | {flow.dateCreated}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 ml-6">
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={isActive}
                                onCheckedChange={() => onToggle(flow.id)}
                                className="data-[state=checked]:bg-black"
                            />
                        </div>

                        <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                            <Eye className="h-4 w-4"/>
                        </Button>

                        <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}