import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ExternalLink, MoreHorizontal} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Switch} from "@/components/ui/switch";
import {useState} from "react";

export default function GeneralSettings() {
    const [activeTab, setActiveTab] = useState("general")
    const [customFieldsEnabled, setCustomFieldsEnabled] = useState(true)
    return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Program details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="program-id">Program ID</Label>
                        <Input
                            id="program-id"
                            value="598f3ba9-b1b8-4bb8-ba78-4ed3c6375cec"
                            readOnly
                            className="bg-muted"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="product-name">Product name</Label>
                        <div className="flex gap-2">
                            <Input id="product-name" value="DunderMifflin"/>
                            <Button variant="outline" size="sm">Update product name</Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="program-name">Partner program name</Label>
                        <div className="flex gap-2">
                            <Input id="program-name" value="Demo Partner Program"/>
                            <Button variant="outline" size="sm">Update program name</Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="website-url">Website URL</Label>
                        <div className="flex gap-2">
                            <Input id="website-url" value="https://tolt.io"/>
                            <Button variant="outline" size="sm">Update website URL</Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="currency">Program currency</Label>
                        <div className="flex gap-2">
                            <Input id="currency" value="USD (United States dollar)"/>
                            <Button variant="outline" size="sm">Update currency</Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="program-type">Program type</Label>
                        <div className="flex gap-2">
                            <Input id="program-type" value="Public"/>
                            <Button variant="outline" size="sm">Update program type</Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subdomain">Portal subdomain</Label>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-1">
                                <Input id="subdomain" value="demoprogram.tolt.io" className="flex-1"/>
                                <ExternalLink className="h-4 w-4 text-muted-foreground"/>
                            </div>
                            <Button variant="outline" size="sm">Update subdomain</Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="terms-of-service">Terms of Service</Label>
                        <div className="flex gap-2">
                            <Input id="terms-of-service" value="https://tolt.io/terms-of-service"/>
                            <Button variant="outline" size="sm">Update ToS link</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Payout details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="min-payout">Minimum payout threshold</Label>
                        <div className="flex gap-2">
                            <Input id="min-payout" value="$99.00"/>
                            <Button variant="outline" size="sm">Update threshold</Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="payout-term">Payout term</Label>
                        <div className="flex gap-2">
                            <Input id="payout-term" value="NET-15"/>
                            <Button variant="outline" size="sm">Update payout term</Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="payout-methods">Payout methods</Label>
                        <div className="flex gap-2">
                            <Input id="payout-methods" value="PayPal, Wise, Wire/SWIFT, Local Bank, Crypto"/>
                            <Button variant="outline" size="sm">Manage methods</Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="crypto-tokens">Crypto tokens</Label>
                        <div className="flex gap-2">
                            <Input id="crypto-tokens" value="BTC, ETH, SOL, ADA, USDT"/>
                            <Button variant="outline" size="sm">Manage tokens</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Custom fields</CardTitle>
                    <CardDescription>
                        Learn more. * indicates that the field is required
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="custom-fields-toggle">Show custom fields in the partner sign-up flow</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="bg-green-100 text-green-800">ON</Badge>
                                <span className="text-sm text-muted-foreground">1 CUSTOM FIELDS</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="custom-fields-toggle"
                                checked={customFieldsEnabled}
                                onCheckedChange={setCustomFieldsEnabled}
                            />
                            <Button variant="outline" size="sm">Add custom field</Button>
                        </div>
                    </div>

                    {customFieldsEnabled && (
                        <div className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col gap-1 text-sm">
                                    <span className="text-muted-foreground">Single answer *</span>
                                </div>
                            </div>
                            <div className="pl-4">
                                <Input
                                    value="Where will you promote Tolt?"
                                    className="mb-2"
                                />
                                <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
    )
}