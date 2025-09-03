import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, Upload, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"

interface Resource {
    id: number
    name: string
    type: "PNG" | "PDF" | "DOC" | "JPG"
    groups: string
    imageUrl?: string
    selected: boolean
}

interface ResourcesFilesTabProps {
    resources: Resource[]
    searchQuery: string
    selectedResources: number[]
    currentPage: number
    onSearchChange: (query: string) => void
    onSelectResource: (resourceId: number) => void
    onSelectAll: (checked: boolean) => void
    onPageChange: (page: number) => void
}

export function ResourcesFilesTab({
                                      resources,
                                      searchQuery,
                                      selectedResources,
                                      currentPage,
                                      onSearchChange,
                                      onSelectResource,
                                      onSelectAll,
                                      onPageChange
                                  }: ResourcesFilesTabProps) {
    const filteredResources = resources.filter((resource) => {
        return searchQuery === "" ||
            resource.name.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const totalItems = filteredResources.length
    const itemsPerPage = 12
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    const getFileTypeColor = (type: string) => {
        switch (type) {
            case "PNG":
                return "bg-green-100 text-green-800"
            case "PDF":
                return "bg-red-100 text-red-800"
            case "DOC":
                return "bg-blue-100 text-blue-800"
            case "JPG":
                return "bg-orange-100 text-orange-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
                    />
                    <Input
                        placeholder="Search by file name..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Files Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredResources.map((resource) => (
                    <div key={resource.id} className="group relative">
                        <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            {/* Checkbox */}
                            <div className="absolute top-3 left-3 z-10">
                                <Checkbox
                                    checked={selectedResources.includes(resource.id)}
                                    onCheckedChange={() => onSelectResource(resource.id)}
                                    className="bg-white shadow-sm"
                                />
                            </div>

                            {/* Image Preview */}
                            <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                {resource.name === "Integrations" && (
                                    <div className="p-4 w-full h-full flex items-center justify-center">
                                        <div className="grid grid-cols-3 gap-2 w-full max-w-24">
                                            {Array.from({ length: 9 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="aspect-square bg-blue-500 rounded"
                                                    style={{
                                                        backgroundColor: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#10b981' : '#f59e0b'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {resource.name === "Dashboard" && (
                                    <div className="p-4 w-full">
                                        <div className="bg-white rounded p-2 text-xs">
                                            <div className="space-y-1">
                                                <div className="h-2 bg-gray-200 rounded"></div>
                                                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                            <div className="mt-2 text-center text-green-600 font-bold">
                                                Ditch the manual tracking,<br/>
                                                say hello to real-time insights
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {resource.name === "Brand Mark" && (
                                    <div className="flex items-center justify-center">
                                        <div className="flex">
                                            <div className="w-8 h-12 bg-gray-800 rounded-l-full"></div>
                                            <div className="w-8 h-12 bg-gray-600 rounded-r-full"></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* File Info */}
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">{resource.groups}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <MoreHorizontal className="h-4 w-4"/>
                                    </Button>
                                </div>

                                <h3 className="font-medium text-base mb-2">{resource.name}</h3>

                                <Badge
                                    variant="secondary"
                                    className={`text-xs ${getFileTypeColor(resource.type)}`}
                                >
                                    {resource.type}
                                </Badge>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredResources.length === 0 && (
                <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                        <h3 className="text-lg font-medium mb-2">No files found</h3>
                        <p className="text-muted-foreground mb-4">
                            Try adjusting your search or upload your first file
                        </p>
                        <Button>
                            <Upload className="h-4 w-4 mr-2"/>
                            Upload file
                        </Button>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalItems > 0 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4"/>
                    </Button>

                    <span className="text-sm text-muted-foreground px-2">
            1 of 1
          </span>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4"/>
                    </Button>
                </div>
            )}
        </div>
    )
}